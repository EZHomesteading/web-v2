"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout/checkout-form";

const stripePromise = loadStripe("your-stripe-publishable-key");

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1000, // Amount in cents
          currency: "usd",
          transferData: {
            destination: "connected-account-id", // Replace with the actual connected account ID
          },
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    };

    fetchClientSecret();
  }, []);

  return (
    <div>
      {/* {clientSecret && ( */}
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
      {/* )} */}
    </div>
  );
};

export default CheckoutPage;
