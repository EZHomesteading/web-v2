import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getListings from "@/app/actions/getListings";
import currentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "../../components/client/ClientOnly";

interface ShopProps {
  userId?: string;
  searchParams?: {
    search?: string;
    subCategory?: string;
  };
}

const DynamicShop = dynamic(() => import("@/app/components/Shop"), {
  ssr: true,
});

const ShopPage = async ({ userId, searchParams }: ShopProps) => {
  const listings = await getListings({ userId, ...searchParams });

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
