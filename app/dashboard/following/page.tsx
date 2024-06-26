//display followijng parent element
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import FavoritesClient from "./FavoritesClient";
import authCache from "@/auth-cache";
import { getFollows } from "@/actions/getFollow";
import { UserInfo } from "@/next-auth";

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
        user={session?.user as unknown as UserInfo | null}
        followarr={followarr}
      />
    </ClientOnly>
  );
};

export default ListingPage;
