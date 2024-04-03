import { currentUser } from "@/lib/auth";
import getCartListings from "@/actions/getCartListings";
import dynamic from "next/dynamic";

const DynamicCheckoutPage = dynamic(
  () => import("@/app/(pages)/checkout/checkout-form"),
  {
    ssr: true,
  }
);

const CheckoutPage = async () => {
  const listings = await getCartListings();
  const user = await currentUser();
  return <DynamicCheckoutPage listings={listings} user={user!} />;
};

export default CheckoutPage;
