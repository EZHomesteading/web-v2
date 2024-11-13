//listing page server side layout, getting users and their carts to display toggle cart options.
import { getUnique } from "@/actions/getListings";
import { Key, Suspense } from "react";
import ClientOnly from "@/components/client/ClientOnly";
import { getCurrentUser } from "@/actions/getUser";
import { getFollows } from "@/actions/getFollow";
import SessionStorageManager from "@/components/sessionStorageManager";
import { FinalListing } from "@/actions/getListings";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import ListingHead from "@/components/listings/ListingHead";
import { outfitFont } from "@/components/fonts";
import Link from "next/link";
import {
  PiArrowLeftThin,
  PiBasketThin,
  PiCheckThin,
  PiInfoThin,
} from "react-icons/pi";
import { auth } from "@/auth";
import ListingClient from "./ListingClient";
import Avatar from "@/components/Avatar";
import SendMessageSection from "./components/send-messge-section";
import SendMessageComponent from "./components/send-message-component";

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const [listing, user, following] = await Promise.all([
      getUnique({ id: params.id }),
      getCurrentUser(),
      getFollows(),
    ]);
    const ratingMeanings: { [key: number]: string } = {
      1: "Not Genetically Modified",
      2: "No Inorganic Fertilizers",
      3: "No Inorganic Pesticides",
      4: "Not Modified After Harvest",
    };

    const inverseRatingMeanings: { [key: number]: string } = {
      1: "May be Genetically Modified",
      2: "May use Inorganic Fertilizers",
      3: "May use Inorganic Pesticides",
      4: "May be Modified After Harvest",
    };
    const applicableRatings = listing.rating.filter(
      (index: number) => index !== 0 && index in ratingMeanings
    );
    const possibleRatings = [1, 2, 3, 4];
    const inverseRatings = possibleRatings.filter(
      (index) => index !== 0 && !applicableRatings.includes(index)
    );
    if (!listing) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <div className="my-4 h-1 w-16 bg-gray-300 mx-auto"></div>
            <h2 className="text-xl">This page could not be found.</h2>
          </div>
        </div>
      );
    }
    const session = await auth();
    return (
      // <ClientOnly>
      //   <Suspense fallback={<div>Loading...</div>}>
      //     <SessionStorageManager />
      //     <ListingClient
      //       listing={listing as FinalListing & { description: string }}
      //       following={following}
      //       user={user}
      //       apiKey={process.env.MAPS_KEY}
      //     />
      //   </Suspense>
      // </ClientOnly>
      <>
        <div
          className={`w-full max-w-5xl relative mx-auto  ${outfitFont.className}`}
        >
          <div className={`fixed top-0 w-full max-w-5xl zmax bg-white`}>
            <div
              className={`h-16  flex justify-between items-center w-full  pr-2 lg:pr-0 pl-1 lg:pl-0`}
            >
              <div className={`flex items-center justify-start space-x-3 `}>
                <Link
                  href={`/market`}
                  prefetch={true}
                  className={`rounded-full border text-black p-3`}
                >
                  <PiArrowLeftThin />
                </Link>
                <div className={` text-3xl font-medium sm:block hidden`}>
                  {listing.title}
                </div>
              </div>
              <div
                className={`flex  hover:cursor-pointer justify-start items-start space-x-1`}
              >
                <div>
                  <PiBasketThin className="text-2xl" />
                </div>
                <div className={`text-md underline font-normal`}>Save</div>
              </div>
            </div>
          </div>
          <div className={`pt-16 -2  `}>
            <ListingHead listing={listing} />
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 px-2 lg:px-0 mt-2 sm:space-x-2`}
          >
            <div className={`col-span-1 lg:col-span-3 `}>
              <div className={` `}>
                <div className={` text-3xl block sm:hidden font-medium `}>
                  {listing.title}
                </div>
                <div className={`text-2xl mt-[-5px]`}>
                  {listing.location.address[1]}, {listing.location.address[2]}
                </div>
                <div
                  className={`flex items-center justify-start space-x-1 text-sm mb-3`}
                >
                  <div>
                    {listing.stock} {listing.quantityType} remaining
                  </div>
                  <div className={`bg-black h-1 w-1 rounded-full`} />
                  <div>
                    ${listing.price} per {listing.quantityType}
                  </div>
                </div>
                <Link
                  className={`border-y py-3 flex items-start justify-start gap-x-2  `}
                  href={`/store/${listing.user.url}`}
                >
                  <Avatar
                    image={listing.location.image || listing.user.image}
                    h="12"
                    h2="16"
                  />
                  <div className={`flex flex-col items-center `}>
                    <div className={`text-xl`}>
                      {listing.location.displayName || listing.user.name}
                    </div>
                    <div>{listing.user?.fullName?.first}</div>
                  </div>
                </Link>
                <ul className="list-none list-inside my-3 space-y-4 border-b pb-3">
                  {applicableRatings.map((ratingIndex: number) => (
                    <li
                      key={ratingIndex}
                      className="text-lg  flex items-center gap-x-1"
                    >
                      <div className={`p-2`}>
                        <PiCheckThin />
                      </div>
                      {ratingMeanings[ratingIndex]}
                    </li>
                  ))}
                  {inverseRatings.map((ratingIndex) => (
                    <li
                      key={ratingIndex}
                      className="text-lg flex items-center gap-x-1"
                    >
                      <div className={`p-2`}>
                        <PiInfoThin />
                      </div>
                      {inverseRatingMeanings[ratingIndex]}
                    </li>
                  ))}
                </ul>
                <div className={`h-[50vh]`}>{listing.description}</div>
              </div>
            </div>
            <div className={`col-span-1 lg:col-span-2 relative`}>
              <SendMessageComponent listing={listing} user={user} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in ListingPage:", error);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Something went wrong!</h1>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
}
