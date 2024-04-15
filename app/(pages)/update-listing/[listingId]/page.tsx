import getListingById from "@/actions/listing/getListingById";

import ClientOnly from "@/app/components/client/ClientOnly";

import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  const currentListing = await getListingById(params);

  return (
    <ClientOnly>
      <UpdateClient currentUser={currentListing} />
    </ClientOnly>
  );
};

export default UpdatePage;
