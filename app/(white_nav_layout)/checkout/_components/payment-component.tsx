"use client";
//stripe payment component
import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Outfit } from "next/font/google";
import { useState } from "react";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function PaymentComponent() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://ezhomesteading.com/dashboard/orders/buyer",
        shipping: null,
      },
    });

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
      setIsLoading(false);
      return;
    } else {
      setMessage("Payment successful");
    }

    setIsLoading(false);
  };

  const options: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };
  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={options} />
        <Button
          className={`${outfit.className} hover:bg-green-900 text-black w-full hover:text-white shadow-md hover:shadow-lg bg-green-300 mt-2`}
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          Pay Now
        </Button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
