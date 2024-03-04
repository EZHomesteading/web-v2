import getCurrentUser from "@/app/actions/getCurrentUser";

import ClientOnly from "@/app/components/ClientOnly";
import getListingById from "@/app/actions/getListingById";

import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdateListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);

  return (
    <ClientOnly>
      <UpdateClient currentListing={listing} />
    </ClientOnly>
  );
};

export default UpdateListingPage;
