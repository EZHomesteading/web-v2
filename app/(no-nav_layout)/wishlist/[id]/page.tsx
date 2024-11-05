import { getUniqueWishList } from "@/actions/wishlist/get/active";
import WishlistServer from "./components/wishlist.server";
import Link from "next/link";
import { PiArrowLeftThin } from "react-icons/pi";
import { getUserLocationsWishList } from "@/actions/getUser";

interface p {
  params: { id: string };
}

const WishlistPage = async ({ params }: p) => {
  const currentUrl = `/wishlists/${params.id}`;
  try {
    const { wishlist } = await getUniqueWishList({ id: params.id });

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }
    const userLocs = await getUserLocationsWishList();
    return (
      <div>
        <Link href="/wishlists" className={`hover:cursor-pointer`}>
          <PiArrowLeftThin className="text-4xl mb-3" />
        </Link>
        <WishlistServer wishlist={wishlist} userLocs={userLocs} />
      </div>
    );
  } catch (error) {
    return (
      <div
        className={`flex justify-center flex-col items-center h-full mt-10 `}
      >
        Your wishlist could not be found
        <Link
          href={currentUrl}
          className={`my-3 text-center bg-black text-white shadow-md p-3 w-full rounded-full max-w-[300px] border  bg-black]`}
        >
          Try again
        </Link>
        <Link
          href="/wishlists"
          className={`max-w-[300px] border text-center p-3  bg-black] rounded-full w-full`}
        >
          Back to Wishlists
        </Link>
      </div>
    );
  }
};

export default WishlistPage;
