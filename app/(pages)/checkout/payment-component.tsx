"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface CheckoutFormProps {
  cartItems: any;
}

export default function PaymentComponent({ cartItems }: CheckoutFormProps) {
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
      const orderDetails = cartItems.map((cartItem: any) => ({
        userId: cartItem.userId,
        listingId: cartItem.listingId,
        pickupDate: cartItem.pickupDate,
        quantity: cartItem.quantity,
        totalPrice: cartItem.listing.price * cartItem.quantity,
        status: "pending",
        conversationId: "",
      }));

      const createOrderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orders: orderDetails }),
      });

      if (!createOrderResponse.ok) {
        setMessage("Failed to create order. Please try again.");
      }
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
