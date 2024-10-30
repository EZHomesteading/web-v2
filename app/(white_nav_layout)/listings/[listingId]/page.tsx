//listing page server side layout, getting users and their carts to display toggle cart options.
import { getListingById } from "@/actions/getListings";
import ClientOnly from "@/components/client/ClientOnly";
import ListingClient from "./ListingClient";
import { getUserwithCart } from "@/actions/getUser";
import { getFollows } from "@/actions/getFollow";
import SessionStorageManager from "@/components/sessionStorageManager";
import { FinalListing } from "@/actions/getListings";
interface IParams {
  listingId?: string;
}

const apiKey = process.env.MAPS_KEY as string;
const ListingPage = async ({ params }: { params: IParams }) => {
  let listing = await getListingById(params);
  const user = await getUserwithCart();
  const following = await getFollows();
  console.log(listing);
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
      <SessionStorageManager />
      <ListingClient
        listing={listing as unknown as FinalListing & { description: string }}
        following={following}
        user={user}
        apiKey={apiKey}
      />
    </ClientOnly>
  );
};

export default ListingPage;
