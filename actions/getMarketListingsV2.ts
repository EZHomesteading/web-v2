import { ShopProps } from "@/app/(nav_market_layout)/market/page";
import { GetApiUrl } from "@/utils/get-url";

function buildQueryString(searchParams?: ShopProps["searchParams"]): string {
  if (!searchParams) return "";

  const params = new URLSearchParams();

  if (searchParams.lat) params.append("lat", searchParams.lat);
  if (searchParams.lng) params.append("lng", searchParams.lng);
  if (searchParams.radius) params.append("radius", searchParams.radius);
  //   if (searchParams.cat) params.append("cat", searchParams.cat);
  //   if (searchParams.subcat) params.append("subcat", searchParams.subcat);
  //   if (searchParams.q) params.append("q", searchParams.q);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function GetMarketListingsV2(
  searchParams?: ShopProps["searchParams"],
  page = 1,
  perPage = 36
) {
  const queryString = buildQueryString(searchParams);

  const apiUrl = GetApiUrl();
  try {
    const response = await fetch(`${apiUrl}/${queryString}`, {
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
