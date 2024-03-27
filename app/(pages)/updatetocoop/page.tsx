import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";

import UpdateClient from "./UpdateClient";

interface IParams {
  listingId?: string;
}

const UpdatePage = async ({ params }: { params: IParams }) => {
  const user = await currentUser();
  return (
    <ClientOnly>
      <UpdateClient user={user} />
    </ClientOnly>
  );
};

export default UpdatePage;
