//update listing parent lement
import { FinalListing, getListingByIdUpdate } from "@/actions/getListings";
import ClientOnly from "@/app/components/client/ClientOnly";
import UpdateClient from "./UpdateClient";
import { SafeListing } from "@/types";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  const listing = await getListingByIdUpdate(params);

  return (
    <ClientOnly>
      {listing ? (
        <UpdateClient listing={listing as unknown as SafeListing} />
      ) : (
        <></>
      )}
    </ClientOnly>
  );
};

export default UpdatePage;
