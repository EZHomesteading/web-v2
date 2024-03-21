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
    radius?: string;
  };
}

const DynamicShop = dynamic(() => import("@/app/(pages)/shop/Shop"), {
  ssr: true,
});

const ShopPage = async ({
  searchParams,
}: {
  searchParams?: ShopProps["searchParams"];
}) => {
  const { q = "", lat = "", lng = "", radius = "30" } = searchParams || {};

  const listings = await getListingsApi({ q, lat, lng, radius });
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
