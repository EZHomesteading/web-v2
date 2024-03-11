import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";

import StoreClient from "./StoreClient";

interface StorePageProps {
  userId: string;
}

const StorePage = async ({ userId }: StorePageProps) => {
  const currentUser = await getCurrentUser();

  const listings = await getListings({ userId: userId });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No products found"
          subtitle="This user does not have any items for sale."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <StoreClient listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default StorePage;
