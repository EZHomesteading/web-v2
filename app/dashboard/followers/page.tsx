//display followers parent element
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import { currentUser } from "@/lib/auth";
import getFollowers from "@/actions/follow/getFollowers";

import FavoritesClient from "./FavoritesClient";
import getFollows from "@/actions/follow/getFollows";

const ListingPage = async () => {
  const user = await currentUser();
  const followarr = await getFollowers();
  const myFollow = await getFollows();
  console.log("initial state", followarr);
  if (!followarr) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite products."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient followarr={followarr} myFollow={myFollow} />
    </ClientOnly>
  );
};

export default ListingPage;
