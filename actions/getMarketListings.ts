// actions/getMarketListings.ts
import { ShopProps } from "@/app/(nav_market_layout)/market/page";
import { z } from "zod";

const searchParamsSchema = z.object({
  lat: z.string().optional(),
  lng: z.string().optional(),
  radius: z.string().optional(),
  q: z.string().optional(),
});

export async function getMarketListings(
  searchParams: ShopProps["searchParams"],
  page: number,
  perPage: number
): Promise<{ listings: any[]; totalItems: number }> {
  try {
    const validatedParams = searchParamsSchema.parse(searchParams);

    const queryString = new URLSearchParams({
      ...validatedParams,
      page: page.toString(),
      perPage: perPage.toString(),
    }).toString();

    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/get/market?${queryString}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error("Market listings response not OK:", await response.text());
      return { listings: [], totalItems: 0 };
    }

    const data = await response.json();

    // Ensure we're returning an array of listings
    return {
      listings: Array.isArray(data.listings) ? data.listings : [],
      totalItems: data.totalItems || 0,
    };
  } catch (error) {
    console.error("Error fetching market listings:", error);
    return {
      listings: [],
      totalItems: 0,
    };
  }
}
