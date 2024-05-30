//checkout page server component to grab all cartitems and send to children
import { getAllCartItemsByUserId } from "@/actions/getCart";
import CheckoutForm from "./checkout-form";

const CheckoutPage = async () => {
  const cartItems = await getAllCartItemsByUserId();

  return <CheckoutForm cartItems={cartItems} />;
};

export default CheckoutPage;
