import { currentUser } from "@/lib/auth";
import BasketCard from "./basket.cards";

import { outfitFont } from "@/components/fonts";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import getActiveBaskets from "@/actions/basket/get/active";

export interface Basket {
  id: string;
  createdAt: Date;
  items: {
    listing: {
      imageSrc: string[];
    };
  }[];
  location: {
    displayName?: string;
    image?: string;
    user: {
      name: string;
      image?: string;
    };
  };
}

const BasketPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }
  const { baskets } = await getActiveBaskets();
  return (
    <div
      className={`${outfitFont.className} px-2 sm:px-8 md:px-16 lg:px-24 2xl:px-32 pt-6 max-w-screen-2xl mx-auto`}
    >
      <div className={`text-4xl font-medium pb-6`}>My Market Baskets</div>
      <div
        className={`grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full`}
      >
        {baskets.map((basket: Basket) => (
          <BasketCard basket={basket} key={basket.id} />
        ))}
      </div>
    </div>
  );
};

export default BasketPage;
