import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import { currentUser } from "@/lib/auth";
import getFollows from "@/actions/follow/getFollows";

import FavoritesClient from "./FavoritesClient";
import authCache from "@/auth-cache";

const ListingPage = async () => {
  const session = await authCache();
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
      <FavoritesClient
        follows={follows}
        user={session?.user}
        followarr={followarr}
      />
    </ClientOnly>
  );
};

export default ListingPage;
