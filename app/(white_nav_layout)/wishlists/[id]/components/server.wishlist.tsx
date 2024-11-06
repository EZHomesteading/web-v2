import { Wishlist_ID_Page } from "wishlist";
import { WishlistLocation } from "@/actions/getUser";
import WishlistCard from "./card.wishlist";
import WishlistClient from "./client.wishlist";

interface p {
  wishlist: Wishlist_ID_Page;
  userLocs: WishlistLocation[] | null;
}

export type item = {
  quantity: number;
  price: number;
  listing: {
    id: string;
    title: string;
    quantityType: string;
    imageSrc: string[];
    stock: number;
    price: number;
    minOrder: number;
    shelfLife: string;
    rating: number[];
    createdAt: Date;
  };
};

const WishlistServer = ({ wishlist, userLocs }: p) => {
  const mk = process.env.MAPS_KEY!;

  return (
    <>
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 min-h-screen`}
      >
        <div
          className={`flex flex-col gap-y-2 col-span-1 sm:col-span-2 pt-16 sm:pt-32`}
        >
          {wishlist.items.map((item: item, index: number) => (
            <WishlistCard item={item} key={index} />
          ))}
        </div>
        <div className={`w-full h-full col-span-1 px-1`}>
          <WishlistClient wishlist={wishlist} userLocs={userLocs} mk={mk} />
        </div>
      </div>
    </>
  );
};

export default WishlistServer;
