"use client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

console.log("Stripe Public Key:", process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const stripePromise = loadStripe(
  "pk_test_51OUbSbIderErSVtgWHtbV9pC98v89g7v8bggK05CvBTosTGspp0VElbIZSupvgdzFmENC38lCNuiWgjQfYDgeCbO00qkywZj7A"
);

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;

      const response = await axios.post("/api/create-checkout-session");
      const { sessionId } = response.data;

      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error(error);
        toast.error("An error occurred while redirecting to Stripe Checkout.");
      } else {
        toast.success("Redirecting to Stripe Checkout...");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred while creating the Stripe Checkout session."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Loading..." : "Proceed to Checkout"}
    </button>
  );
};

export default Checkout;
