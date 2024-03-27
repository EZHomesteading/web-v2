import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import { currentUser } from "@/lib/auth";
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
  const { q = "", lat = "", lng = "", radius = "" } = searchParams || {};

  const listings = await getListingsApi({ q, lat, lng, radius });
  const user = await currentUser();
  return (
    <DynamicShop
      listings={listings}
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

export default ShopPage;
