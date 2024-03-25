import getCurrentUser from "@/app/actions/getCurrentUserAsync";

import ClientOnly from "@/app/components/client/ClientOnly";

import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  return (
    <ClientOnly>
      <UpdateClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default UpdatePage;
