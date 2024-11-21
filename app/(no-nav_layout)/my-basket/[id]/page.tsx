import { getUserLocationsBasket } from "@/actions/getUser";
import BasketNotFound from "../[...not-found]/page";
import BasketServer from "./components/server.basket";
import getUnique from "@/actions/basket/get/unique";

interface p {
  params: { id: string };
}

const BasketPage = async ({ params }: p) => {
  try {
    const { basket } = await getUnique({ id: params.id });

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
