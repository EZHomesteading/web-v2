import { currentUser } from "@/lib/auth";
import getListingById from "@/actions/listing/getListingById";

import ClientOnly from "@/app/components/client/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";
import getUserwithCart from "@/actions/user/getUserWithCart";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  let listing = await getListingById(params);
  const userpre = await currentUser();
  const userId = { userId: userpre?.id };
  const user = await getUserwithCart(userId);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient listing={listing} user={user} />
    </ClientOnly>
  );
};

export default ListingPage;
