"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

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
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
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

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button
          className="border-black border-[1px] rounded-md p-2 w-full hover:text-green-900"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          Pay Now
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
