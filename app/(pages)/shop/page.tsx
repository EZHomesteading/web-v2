import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";
import ClientOnly from "../../components/client/ClientOnly";
import getListingsApi from "@/app/actions/getListingsApi";

interface ShopProps {
  userId?: string;
  searchParams?: {
    q?: string;
    lat?: string;
    lng?: string;
    r?: string;
  };
}

const DynamicShop = dynamic(() => import("@/app/components/Shop"), {
  ssr: true,
});

const ShopPage = async ({
  searchParams,
}: {
  searchParams?: ShopProps["searchParams"];
}) => {
  const { q = "", lat = "", lng = "", r = "30" } = searchParams || {};

  const listings = await getListingsApi({ q, lat, lng, r });
  const currentUser = await getCurrentUser();
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
