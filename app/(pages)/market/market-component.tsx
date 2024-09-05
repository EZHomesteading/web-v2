//render market product cards on server, with toggle cart buttons
"use client";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "@/app/components/client/ClientOnly";
import Link from "next/link";
import SessionStorageManager from "@/app/components/sessionStorageManager";
import LocationPermissionPopup from "@/app/(home)/location-permission-modal";
import { SkeletonCard } from "./skeleton-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";
import { FinalListing } from "@/actions/getListings";
import { UserInfo } from "@/next-auth";

interface ShopProps {
  listings: FinalListing[];
  user: UserInfo;
  emptyState: React.ReactNode;
  totalPages: number;
  prevPage: number;
  nextPage: number;
  isPageOutOfRange: boolean;
  pageNumbers: number[];
  currentPage: number;
}

const Shop = ({
  listings,
  user,
  emptyState,
  totalPages,
  isPageOutOfRange,
  pageNumbers,
  currentPage,
}: ShopProps) => {
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   const getLocation = () => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const lat = position.coords.latitude;
  //           const lng = position.coords.longitude;
  //           const radius = 20; // Set the default radius to 20 (adjust as needed)

  //           const query = {
  //             lat: lat.toString(),
  //             lng: lng.toString(),
  //             radius: radius.toString(),
  //           };

  //           const url = qs.stringifyUrl(
  //             {
  //               url: "/market",
  //               query,
  //             },
  //             { skipNull: true }
  //           );

  //           router.push(url);
  //           setIsLoading(false);
  //         },
  //         (error) => {
  //           console.error("Error getting location: ", error);
  //           setShowPopup(true);
  //           setIsLoading(false);
  //         }
  //       );
  //     } else {
  //       console.error("Geolocation is not supported by this browser.");
  //       setIsLoading(false);
  //     }
  //   };

  //   getLocation();
  // }, []);
  return (
    <ClientOnly>
      <SessionStorageManager />
      <Container>
        {/* {showPopup && <LocationPermissionPopup />} */}
        {/* {isLoading ? (
          <div className="pt-2 md:pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <> */}
        {emptyState || (
          <div className="pt-2 md:pt-5 grid  grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
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
            {isPageOutOfRange ? (
              <></>
            ) : (
              <div className="flex justify-center items-end mt-16">
                <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
                  {/* builds cards dynamically based on data passed in */}
                  {pageNumbers.map((pageNumber, index) => (
                    <Link
                      key={index}
                      className={
                        currentPage === pageNumber
                          ? "bg-green-600 fw-bold px-2 rounded-md text-black"
                          : "hover:bg-green-600 px-1 rounded-md"
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
        {/* </>
        )} */}
      </Container>
    </ClientOnly>
  );
};

export default Shop;
