import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";
import getFollows from "@/actions/follow/getFollows";

import getUserStore from "@/actions/user/getUserStore";

import SessionStorageManager from "@/app/components/sessionStorageManager";

interface StorePageProps {
  params: {
    storeId: string;
  };
}

const DynamicStorePage = dynamic(
  () => import("@/app/(pages)/store/[storeId]/Store"),
  {
    ssr: true,
  }
);

const StorePage = async ({ params }: StorePageProps) => {
  const { storeId } = params;
  const storeUser = await getUserStore({ userId: storeId });
  const user = await currentUser();
  const following = await getFollows();

  return (
    <>
      <ClientOnly>
        <SessionStorageManager />
      </ClientOnly>
      <DynamicStorePage
        storeUser={storeUser}
        user={user}
        following={following}
        emptyState={
          storeUser?.listings.length === 0 ? (
            <ClientOnly>
              <EmptyState showReset />
            </ClientOnly>
          ) : null
        }
      />
    </>
  );
};

export default StorePage;
