// app/checkout/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import getActiveBaskets from "@/actions/basket/get/active";
import getUnique from "@/actions/basket/get/unique";
import CheckoutForm from "./_components/checkout-form";
import { getUserLocations } from "@/actions/getLocations";

const CheckoutPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { baskets: basicBaskets } = await getActiveBaskets();

  if (!basicBaskets || basicBaskets.length === 0) {
    redirect("/market-baskets");
  }

  const detailedBasketsPromises = basicBaskets.map(async (basket) => {
    const { basket: detailedBasket } = await getUnique({ id: basket.id });
    return detailedBasket;
  });

  const detailedBaskets = (await Promise.all(detailedBasketsPromises)).filter(
    Boolean
  );

  const userLoc = await getUserLocations({ userId: session.user.id });

  return (
    <CheckoutForm
      baskets={detailedBaskets}
      userId={session.user.id}
      userLoc={userLoc || null}
      userEmail={session.user.email}
    />
  );
};

export default CheckoutPage;
