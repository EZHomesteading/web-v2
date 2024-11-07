import { currentUser } from "@/lib/auth";
import BasketCard from "./basket.cards";
import { getActiveBaskets } from "@/actions/basket/get/active";
import { outfitFont } from "@/components/fonts";

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
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const response = await getActiveBaskets();
  const { baskets } = response;
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
