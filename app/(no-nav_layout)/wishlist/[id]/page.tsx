import { getUniqueWishList } from "@/actions/wishlist/get/active";
import WishlistServer from "./components/wishlist.server";
import { getUserLocationsWishList } from "@/actions/getUser";
import WishlistNotFound from "../[...not-found]/page";

interface p {
  params: { id: string };
}

const WishlistPage = async ({ params }: p) => {
  try {
    const { wishlist } = await getUniqueWishList({ id: params.id });

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }
    const userLocs = await getUserLocationsWishList();
    return <WishlistServer wishlist={wishlist} userLocs={userLocs} />;
  } catch (error) {
    return <WishlistNotFound />;
  }
};

export default WishlistPage;
