import { currentUser } from "@/lib/auth";
import getListingById from "@/actions/listing/getListingById";

import ClientOnly from "@/app/components/client/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";
import getUserwithCart from "@/actions/user/getUserWithCart";
import getFollows from "@/actions/follow/getFollows";
import getSellerReviews from "@/actions/reviews/getSellerReviews";
import getBuyerReviews from "@/actions/reviews/getBuyerReviews";
import getSellerAvg from "@/actions/reviews/getSellerAvg";
import getBuyerAvg from "@/actions/reviews/getBuyerAvg";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  let listing = await getListingById(params);
  const user = await getUserwithCart();
  const following = await getFollows();
  if (!listing) {
    return;
  }
  const sellerRevs = await getSellerReviews({ reviewedId: listing?.user?.id });
  const buyerRevs = await getBuyerReviews({ reviewedId: listing?.user?.id });
  const sellerAvg = await getSellerAvg({ reviewedId: listing?.user?.id });
  const buyerAvg = await getBuyerAvg({ reviewedId: listing?.user?.id });
  console.log(sellerAvg, sellerRevs, buyerAvg, buyerRevs);
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient listing={listing} following={following} user={user} />
    </ClientOnly>
  );
};

export default ListingPage;
