//server side layout for users dynamically generated stores.
import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import { getFollows } from "@/actions/getFollow";
import { StoreData, getUserStore } from "@/actions/getUser";
import SessionStorageManager from "@/app/components/sessionStorageManager";
import { getUserwithCart } from "@/actions/getUser";
import { UserInfo } from "next-auth";

interface StorePageProps {
  params: {
    url: string;
  };
}

const DynamicStorePage = dynamic(
  () => import("@/app/(pages)/store/[url]/Store"),
  {
    ssr: true,
  }
);
const StorePage = async ({ params }: StorePageProps) => {
  const { url } = params;
  const store = await getUserStore({ url: url });
  const user = await getUserwithCart();
  const following = await getFollows();
  return (
    <>
      <ClientOnly>
        <SessionStorageManager />
      </ClientOnly>
      <DynamicStorePage
        store={store}
        user={user as unknown as UserInfo}
        following={following}
        emptyState={
          !store ? (
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
