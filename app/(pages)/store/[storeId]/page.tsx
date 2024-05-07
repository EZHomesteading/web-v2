import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getListingsByUserId from "@/actions/listing/getListingsByUserId";
import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";
import getUserById from "@/actions/user/getUserById";
import getFollows from "@/actions/follow/getFollows";

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
  const following = await getFollows();

  return (
    <DynamicStorePage
      listings={listings}
      storeUser={storeUser}
      user={user}
      following={following}
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
