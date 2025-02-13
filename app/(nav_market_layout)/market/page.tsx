// market server side layout with search parameters for grabbing data
import dynamic from "next/dynamic";
import { getCurrentUser } from "@/actions/getUser";
import { UserInfo } from "next-auth";
import { MarketListing } from "@/app/(nav_market_layout)/market/(components)/market-component";

export interface ShopProps {
  userId?: string;
  searchParams?: {
    q?: string;
    lat?: string;
    lng?: string;
    radius?: string;
    page?: string;
    c?: string;
    p?: string;
    s?: string;
    ra?: string;
    pr?: string;
    cat?: string;
    subcat?: string;
  };
}

const MarketComponent = dynamic(
  () =>
    import("@/app/(nav_market_layout)/market/(components)/market-component"),
  {
    ssr: true,
  }
);

interface basket {
  listingId: string;
  id: string;
}
const ShopPage = async ({
  searchParams,
}: {
  searchParams?: ShopProps["searchParams"];
}) => {
  const apiUrl = process.env.API_URL;

  let user = await getCurrentUser();
  let basketItemIds: any = [];
  let listings: MarketListing[] = [];
  const params = new URLSearchParams({
    ...(searchParams?.lat && { lat: searchParams.lat }),
    ...(searchParams?.lng && { lng: searchParams.lng }),
    ...(searchParams?.radius && { radius: searchParams.radius }),
    ...(searchParams?.q && { q: searchParams.q }),
  });

  const requests = [
    user?.id
      ? fetch(
          `${apiUrl}/get-many?collection=BasketItem&key=userId&value=${user.id}&fields=listingId`
        ).then((res) => res.json())
      : Promise.resolve([]),
    fetch(`${apiUrl}/market?${params.toString()}`).then((res) => res.json()),
  ];
  const [basketItems, marketData] = await Promise.all(requests);

  basketItemIds = basketItems.items;
  listings = marketData.items;

  return (
    <MarketComponent
      listings={listings as unknown as MarketListing[]}
      user={user as unknown as UserInfo}
      basketItemIds={basketItemIds || []}
      params={params.toString()}
    />
  );
};

export default ShopPage;
