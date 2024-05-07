import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import getListingsByUserId from "@/actions/listing/getListingsByUserId";
import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";
import getUserById from "@/actions/user/getUserById";
import getFollows from "@/actions/follow/getFollows";
import getSellerReviews from "@/actions/reviews/getSellerReviews";
import { Reviews } from "@prisma/client";

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
  const reviews = await getSellerReviews({ reviewedId: storeId });
  const user = await currentUser();
  const following = await getFollows();
  // const reviwers: Record<string, Reviews[]> = cart.reduce(
  //   (acc: Record<string, Reviews[]>, item: Reviews) => {
  //     const
  //     if (!acc[userId]) {
  //       acc[userId] = [];
  //     }
  //     acc[userId].push(item);
  //     return acc;
  //   },
  //   {} as Record<string, CartItem[]>
  // );
  return (
    <DynamicStorePage
      listings={listings}
      storeUser={storeUser}
      reviews={reviews}
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
