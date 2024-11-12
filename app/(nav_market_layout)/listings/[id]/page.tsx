//listing page server side layout, getting users and their carts to display toggle cart options.
import { getUnique } from "@/actions/getListings";
import { Suspense } from "react";
import ClientOnly from "@/components/client/ClientOnly";
import { getCurrentUser } from "@/actions/getUser";
import { getFollows } from "@/actions/getFollow";
import SessionStorageManager from "@/components/sessionStorageManager";
import { FinalListing } from "@/actions/getListings";
import ListingClient from "./ListingClient";
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
import { PiArrowLeftThin } from "react-icons/pi";
import { auth } from "@/auth";

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
    const session = await auth();
    console.log(session?.user);
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
    return (
      <ClientOnly>
        <Suspense fallback={<div>Loading...</div>}>
          <SessionStorageManager />
          <ListingClient
            listing={listing as FinalListing & { description: string }}
            following={following}
            user={user}
            apiKey={process.env.MAPS_KEY}
          />
        </Suspense>
      </ClientOnly>
      // <>
      //   <div className={`w-full max-w-5xl mx-auto`}>
      //     <div
      //       className={`h-16 px-2 sm:px-0 flex justify-between items-center w-full`}
      //     >
      //       <div
      //         className={`${outfitFont.className} text-3xl font-medium sm:block hidden`}
      //       >
      //         {listing.title}
      //       </div>
      //       <Link
      //         href={`/market`}
      //         className={`rounded-full border text-black p-3`}
      //       >
      //         <PiArrowLeftThin />
      //       </Link>
      //       <div></div>
      //       <div></div>
      //     </div>
      //     <ListingHead listing={listing} />
      //   </div>
      // </>
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
