import { currentUser } from "@/lib/auth";
import getListingById from "@/actions/listing/getListingById";

import ClientOnly from "@/app/components/client/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";
import getUserwithCart from "@/actions/user/getUserWithCart";
import getFollows from "@/actions/getFollows";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  let listing = await getListingById(params);
  const user = await getUserwithCart();
  const following = await getFollows();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient listing={listing} following={following} user={user} />
    </ClientOnly>
  );
};

export default ListingPage;
