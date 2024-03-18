import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getListings from "@/app/actions/getListings";
import currentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/client/ClientOnly";
import getUserById from "@/app/actions/getUserById";

interface StorePageProps {
  params: {
    storeId: string;
  };
}

const DynamicStorePage = dynamic(() => import("@/app/components/Store"), {
  ssr: true,
});

const StorePage = async ({ params }: StorePageProps) => {
  const { storeId } = params;
  const listings = await getListings({ userId: storeId });
  const user = await getUserById({ userId: storeId });

  return (
    <DynamicStorePage
      listings={listings}
      user={user}
      currentUser={currentUser}
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
