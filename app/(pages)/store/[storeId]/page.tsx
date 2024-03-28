import dynamic from "next/dynamic";
import EmptyState from "@/components/EmptyState";
import getListings from "@/actions/getListings";
import { currentUser } from "@/lib/auth";
import ClientOnly from "@/components/client/ClientOnly";
import getUserById from "@/actions/getUserById";

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
  const listings = await getListings({ userId: storeId });
  const storeUser = await getUserById({ userId: storeId });
  const user = await currentUser();

  return (
    <DynamicStorePage
      listings={listings}
      storeUser={storeUser}
      user={user}
      emptyState={
        listings.length === 0 ? (
          <ClientOnly>
            <EmptyState showReset />
          </ClientOnly>
        ) : null
      }
    />
  );
};

export default StorePage;
