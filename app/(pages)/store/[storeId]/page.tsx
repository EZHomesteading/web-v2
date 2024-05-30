//server side layout for users dynamically generated stores.
import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import getFollows from "@/actions/follow/getFollows";
import { getUserStore } from "@/actions/getUser";
import SessionStorageManager from "@/app/components/sessionStorageManager";
import { getUserwithCart } from "@/actions/getUser";

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
  const user = await getUserwithCart();
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
          !storeUser || storeUser?.listings.length === 0 ? (
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
