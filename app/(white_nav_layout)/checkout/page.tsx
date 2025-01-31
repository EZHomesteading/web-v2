// app/checkout/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import getActiveBaskets from "@/actions/basket/get/active";
import getUnique from "@/actions/basket/get/unique";
import CheckoutForm from "./_components/checkout-form";
import { getUserLocations } from "@/actions/getUser";

const CheckoutPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get the basic basket info first
  const { baskets: basicBaskets } = await getActiveBaskets();

  // Don't proceed to checkout if no baskets
  if (!basicBaskets || basicBaskets.length === 0) {
    redirect("/market-baskets");
  }

  // Get detailed info for each basket
  const detailedBasketsPromises = basicBaskets.map(async (basket) => {
    const { basket: detailedBasket } = await getUnique({ id: basket.id });
    return detailedBasket;
  });

  const detailedBaskets = (await Promise.all(detailedBasketsPromises)).filter(
    Boolean
  );

  // Get user location data
  const userLoc = await getUserLocations({ userId: session.user.id });

  return (
    <CheckoutForm
      baskets={detailedBaskets}
      userId={session.user.id}
      userLoc={userLoc || null}
    />
  );
};

export default CheckoutPage;
