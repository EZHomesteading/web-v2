//display followers parent element
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/client/ClientOnly";

import FavoritesClient from "./FavoritesClient";
import { getFollowers, getFollows } from "@/actions/getFollow";

const ListingPage = async () => {
  const followarr = await getFollowers();
  const myFollow = await getFollows();
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
