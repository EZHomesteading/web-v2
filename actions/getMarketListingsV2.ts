import { ShopProps } from "@/app/(nav_market_layout)/market/page";
import { GetApiUrl } from "@/utils/get-url";

export async function GetMarketListingsV2(
  searchParams?: ShopProps["searchParams"],
  page = 1,
  perPage = 36
) {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    ...(searchParams?.lat && { lat: searchParams.lat }),
    ...(searchParams?.lng && { lng: searchParams.lng }),
    ...(searchParams?.radius && { radius: searchParams.radius }),
    ...(searchParams?.q && { q: searchParams.q }),
  });

  const apiUrl = process.env.API_URL;
  try {
    const response = await fetch(`${apiUrl}/market?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch market listings");
    }

    return response.json();
  } catch (error) {
    console.error("Market listings fetch error:", error);
    return { listings: [], totalItems: 0 };
  }
}
