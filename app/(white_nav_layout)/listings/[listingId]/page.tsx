//listing page server side layout, getting users and their carts to display toggle cart options.
import { getListingById } from "@/actions/getListings";
import { Suspense } from "react";
import ClientOnly from "@/components/client/ClientOnly";
import ListingClient from "./ListingClient";
import { getCurrentUser } from "@/actions/getUser";
import { getFollows } from "@/actions/getFollow";
import SessionStorageManager from "@/components/sessionStorageManager";
import { FinalListing } from "@/actions/getListings";

export default async function ListingPage({
  params,
}: {
  params: { listingId: string };
}) {
  try {
    // Fetch all data in parallel
    const [listing, user, following] = await Promise.all([
      getListingById({ listingId: params.listingId }),
      getCurrentUser(),
      getFollows(),
    ]);

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
    console.log(listing);
    return (
      <ClientOnly>
        <Suspense fallback={<div>Loading...</div>}>
          <SessionStorageManager />
          <ListingClient
            listing={listing as FinalListing & { description: string }}
            following={following}
            user={user}
            apiKey={process.env.MAPS_KEY || ""}
          />
        </Suspense>
      </ClientOnly>
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
