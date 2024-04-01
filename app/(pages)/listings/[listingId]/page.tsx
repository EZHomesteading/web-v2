import { currentUser } from "@/lib/auth";
import getListingById from "@/actions/getListingById";

import ClientOnly from "@/app/components/client/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  let listing = await getListingById(params);
  const user = await currentUser();

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
