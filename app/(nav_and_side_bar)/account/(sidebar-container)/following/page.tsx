//display followijng parent element
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/client/ClientOnly";
import FavoritesClient from "./FavoritesClient";
import { getFollows } from "@/actions/getFollow";

const ListingPage = async () => {
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
      <FavoritesClient follows={follows} followarr={followarr} />
    </ClientOnly>
  );
};

export default ListingPage;
