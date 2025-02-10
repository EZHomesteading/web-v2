// market server side layout with search parameters for grabbing data

import dynamic from "next/dynamic";
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/client/ClientOnly";
import { getCurrentUser } from "@/actions/getUser";
import { UserInfo } from "next-auth";
import { getMarketListings } from "@/actions/getMarketListings";
import { MarketListing } from "@/app/(nav_market_layout)/market/_components/market-component";
import { Get } from "@/actions/getCart";
import { GetMarketListingsV2 } from "@/actions/getMarketListingsV2";

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
  () => import("@/app/(nav_market_layout)/market/_components/market-component"),
  {
    ssr: true,
  }
);

const ShopPage = async ({
  searchParams,
}: {
  searchParams?: ShopProps["searchParams"];
}) => {
  const page = Math.max(1, parseInt(searchParams?.page ?? "1"));
  const perPage = 36;
  const response = await GetMarketListingsV2(searchParams, page, perPage);
  // const response = await getMarketListings(searchParams, page, perPage);

  // const { listings = [], totalItems = 0 } = response || {};
  const totalItems = response.totalCount;
  const listings = response.items;
  for (let i = 0; i < listings.length; i++) {
    console.log(listings[i]?.imageSrc);
  }
  let user = await getCurrentUser();
  let basketItemIds: string[] = [];
  if (user?.id) {
    const temp = await Get(
      `get-many?collection=BasketItem&key=userId&value=${user?.id}`
    );
    basketItemIds = temp?.items;
  }
  const totalPages = Math.ceil(totalItems / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;

  const pageNumbers = [];
  const offsetNumber = 1003;

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }
  return (
    <MarketComponent
      listings={listings as unknown as MarketListing[]}
      user={user as unknown as UserInfo}
      emptyState={
        listings.length === 0 ? (
          <ClientOnly>
            <EmptyState showReset />
          </ClientOnly>
        ) : null
      }
      totalPages={totalPages}
      prevPage={prevPage}
      nextPage={nextPage}
      isPageOutOfRange={isPageOutOfRange}
      pageNumbers={pageNumbers}
      currentPage={page}
      basketItemIds={basketItemIds}
    />
  );
};

export default ShopPage;
