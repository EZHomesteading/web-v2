//render market product cards on server, with toggle cart buttons
"use client";
import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";
import ClientOnly from "@/components/client/ClientOnly";
import Link from "next/link";
import SessionStorageManager from "@/components/sessionStorageManager";
// import LocationPermissionPopup from "@/app/(home)/location-permission-modal";
// import { SkeletonCard } from "./skeleton-card";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import qs from "query-string";
import { FinalListing } from "@/actions/getListings";
import { Outfit } from "next/font/google";
import { UserInfo } from "next-auth";

interface ShopProps {
  listings: FinalListing[];
  user?: UserInfo;
  emptyState: React.ReactNode;
  totalPages: number;
  prevPage: number;
  nextPage: number;
  isPageOutOfRange: boolean;
  pageNumbers: number[];
  currentPage: number;
}
const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const Shop = ({
  listings,
  user,
  emptyState,
  totalPages,
  isPageOutOfRange,
  pageNumbers,
  currentPage,
}: ShopProps) => {
  return (
    <ClientOnly>
      <SessionStorageManager />
      <Container>
        {emptyState || (
          <div className="pt-[140px] pb-[90px] sm:pb-0 md:pt-5 grid  grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings.map((listing: FinalListing, index) => (
              <ListingCard
                user={user}
                key={listing.id}
                data={listing}
                storeUser={listing.user as unknown as UserInfo}
                priority={index === 0}
              />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <>
            {isPageOutOfRange && (
              <div
                className={`flex justify-center items-end my-4 ${outfit.className}`}
              >
                <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
                  {pageNumbers.map((pageNumber, index) => (
                    <Link
                      key={index}
                      className={
                        currentPage === pageNumber
                          ? "bg-emerald-900 fw-bold px-2 rounded-md text-white"
                          : "hover:bg-emerald-800 hover:text-white px-1 rounded-md"
                      }
                      href={`?page=${pageNumber}`}
                    >
                      {pageNumber}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </ClientOnly>
  );
};

export default Shop;
