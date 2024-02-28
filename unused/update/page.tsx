import getCurrentUser from "@/app/actions/getCurrentUser";

import ClientOnly from "@/app/components/ClientOnly";

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
