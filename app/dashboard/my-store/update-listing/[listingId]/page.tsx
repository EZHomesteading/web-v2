//update listing parent lement
import { getListingByIdUpdate } from "@/actions/getListings";
import ClientOnly from "@/app/components/client/ClientOnly";
import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  const listing = await getListingByIdUpdate(params);

  return (
    <ClientOnly>
      {listing ? <UpdateClient listing={listing} /> : <></>}
    </ClientOnly>
  );
};

export default UpdatePage;
