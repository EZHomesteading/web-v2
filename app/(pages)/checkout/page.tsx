import { getAllCartItemsByUserId } from "@/actions/getCart";
import StripeCheckout from "./checkout";

const CheckoutPage = async () => {
  const cartItems = await getAllCartItemsByUserId();
  return <StripeCheckout cartItems={cartItems} />;
};

export default CheckoutPage;
