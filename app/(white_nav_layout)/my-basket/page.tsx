import { auth } from "@/auth";
import { redirect } from "next/navigation";
import getActiveBaskets from "@/actions/basket/get/active";
import { getUserLocationsBasket } from "@/actions/getUser";
import getUnique from "@/actions/basket/get/unique";
import DetailedBasketGrid from "./components/DetailedBasketGrid";
import { getUserLocations } from "@/actions/getLocations";

const BasketPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }
  const map_api_key = process.env.MAPS_KEY as string;
  // Get the basic basket info first
  const { baskets: basicBaskets } = await getActiveBaskets();
  const userLocs = await getUserLocationsBasket();
  const mk = process.env.MAPS_KEY;

  // Get detailed info for each basket
  const detailedBasketsPromises = basicBaskets.map(async (basket) => {
    const { basket: detailedBasket } = await getUnique({ id: basket.id });
    return detailedBasket;
  });

  const detailedBaskets = (await Promise.all(detailedBasketsPromises)).filter(
    Boolean
  );
  const userLoc = await getUserLocations({ userId: session.user.id });

  return (
    <DetailedBasketGrid
      mapsKey={map_api_key}
      baskets={detailedBaskets}
      userLocs={userLocs}
      mk={mk}
      userId={session.user.id}
      userLoc={userLoc}
      userName={session.user.name}
    />
  );
};

export default BasketPage;
