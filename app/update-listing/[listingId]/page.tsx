import getListingById from "@/actions/listing/getListingById";
import ClientOnly from "@/app/components/client/ClientOnly";
import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);

  return (
    <ClientOnly>
      {listing ? <UpdateClient listing={listing} /> : <></>}
    </ClientOnly>
  );
};

export default UpdatePage;
