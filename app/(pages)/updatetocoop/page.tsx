import currentUser from "@/app/actions/getCurrentUser";

import ClientOnly from "@/app/components/client/ClientOnly";

import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  return (
    <ClientOnly>
      <UpdateClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default UpdatePage;
