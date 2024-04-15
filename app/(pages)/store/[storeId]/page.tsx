import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getListingsByUserId from "@/actions/getListingsByUserId";
import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";
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
  const listings = await getListingsByUserId({ userId: storeId });
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
