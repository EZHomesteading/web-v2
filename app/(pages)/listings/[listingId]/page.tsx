//listing page server side layout, getting users and their carts to display toggle cart options.
import { getListingById } from "@/actions/getListings";
import ClientOnly from "@/app/components/client/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import { getUserwithCart } from "@/actions/getUser";
import { getFollows } from "@/actions/getFollow";
import SessionStorageManager from "@/app/components/sessionStorageManager";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  let listing = await getListingById(params);
  const user = await getUserwithCart();
  const following = await getFollows();
  if (!listing) {
    return;
  }

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <SessionStorageManager />
      <ListingClient listing={listing} following={following} user={user} />
    </ClientOnly>
  );
};

export default ListingPage;
