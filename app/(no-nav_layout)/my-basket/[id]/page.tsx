import { getUserLocationsBasket } from "@/actions/getUser";
import BasketNotFound from "../[...not-found]/page";
import BasketServer from "./components/server.basket";
import { getUniqueBasket } from "@/actions/basket/get/active";

interface p {
  params: { id: string };
}

const BasketPage = async ({ params }: p) => {
  try {
    const { basket } = await getUniqueBasket({ id: params.id });

    if (!basket) {
      throw new Error("Basket not found");
    }
    const userLocs = await getUserLocationsBasket();
    return <BasketServer basket={basket} userLocs={userLocs} />;
  } catch (error) {
    return <BasketNotFound />;
  }
};

export default BasketPage;
