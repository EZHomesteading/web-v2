import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import { currentUser } from "@/lib/auth";
import getFollows from "@/actions/getFollows";

import FavoritesClient from "./FavoritesClient";

const ListingPage = async () => {
  const user = await currentUser();
  const followarr = await getFollows();
  const follows = followarr?.follows;
  if (!follows) {
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
      <FavoritesClient follows={follows} user={user} />
    </ClientOnly>
  );
};

export default ListingPage;
