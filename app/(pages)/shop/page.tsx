import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";

import getListings, { IListingsParams } from "@/app/actions/getListings";
import currentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "../../components/client/ClientOnly";

interface ShopProps {
  searchParams: IListingsParams;
}

const DynamicShop = dynamic(() => import("@/app/components/Shop"), {
  ssr: true,
});

const ShopPage = async ({ searchParams }: ShopProps) => {
  const listings = await getListings(searchParams);

  return (
    <DynamicShop
      listings={listings}
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

export default ShopPage;
