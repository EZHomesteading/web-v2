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
import { useState } from "react";
import { MarketGrid } from "./_components/market-card";
import { SkeletonCard } from "./_components/skeleton-card";

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
  const totalItems = response.totalCount;
  const listings = response.items;

  // const response = await getMarketListings(searchParams, page, perPage);
  // const { listings = [], totalItems = 0 } = response || {};

  let user = await getCurrentUser();
  let basketItemIds: any[] = [];
  if (user?.id) {
    const temp = await Get(
      `get-many?collection=BasketItem&key=userId&value=${user?.id}&fields=listingId`
    );
    basketItemIds = temp?.items;
  }
  console.log(basketItemIds);
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
