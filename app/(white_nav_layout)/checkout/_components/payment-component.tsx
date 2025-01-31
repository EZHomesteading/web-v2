"use client";

import { outfitFont } from "@/components/fonts";
import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useState } from "react";

export default function PaymentComponent() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/orders/buyer`,
        shipping: null,
      },
    });

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
    } else {
      setMessage("Payment successful");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        className={`${outfitFont.className} hover:bg-green-900 text-black w-full hover:text-white shadow-md hover:shadow-lg bg-green-300 mt-2`}
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
      {message && (
        <div
          id="payment-message"
          className="mt-4 text-center text-sm text-gray-600"
        >
          {message}
        </div>
      )}
    </form>
  );
}
