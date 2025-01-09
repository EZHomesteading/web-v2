import { getNavUser, NavUser, BasketLocation } from "@/actions/getUser";
import BasketCard from "./card.basket";
import BasketClient from "./client.basket";
import Navbar from "@/components/navbar/navbar";
import { Basket_ID_Page } from "basket";

interface p {
  basket: Basket_ID_Page;
  userLocs: BasketLocation[] | null;
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

const BasketServer = async ({ basket, userLocs }: p) => {
  const mk = process.env.MAPS_KEY!;
  const user = await getNavUser();
  if (!user) {
    return;
  }
  return (
    <>
      <Navbar user={user as unknown as NavUser} className="hidden md:block" />
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 min-h-screen`}
      >
        <div className={`flex flex-col gap-y-2 col-span-1 sm:col-span-2 pt-32`}>
          {basket.items.map((item: item, index: number) => (
            <BasketCard item={item} key={index} />
          ))}
        </div>
        <div className={`w-full h-full col-span-1 px-1`}>
          <BasketClient
            userId={user?.id}
            basket={basket}
            userLocs={userLocs}
            mk={mk}
          />
        </div>
      </div>
    </>
  );
};

export default BasketServer;
