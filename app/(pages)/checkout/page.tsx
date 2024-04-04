import { getAllCartItemsByUserId } from "@/actions/getCart";
import StripeCheckout from "./credit-card";

const CheckoutPage = async () => {
  const cartItems = await getAllCartItemsByUserId();
  console.log(cartItems);
  return <StripeCheckout cartItems={cartItems} />;
};

export default CheckoutPage;
