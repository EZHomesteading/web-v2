import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";
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
  const currentUser = await getCurrentUser();

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
