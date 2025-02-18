"use client";

import { OutfitFont } from "@/components/fonts";
import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "axios";

interface PaymentIntentData {
  clientSecret: string;
  basketId: string;
  totalAmount: number;
}

interface PaymentFormProps {
  userEmail: string;
  paymentIntents: PaymentIntentData[];
  customerId?: string;
}

export default function PaymentComponent({
  userEmail,
  paymentIntents,
  customerId,
}: PaymentFormProps) {
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
    setMessage("");

    try {
      // Submit the form first to validate payment details
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Get or create customer
      const { data: customerData } = await axios.post(
        "/api/stripe/get-or-create-customer",
        {
          email: userEmail,
          existingCustomerId: customerId,
        }
      );

      let paymentMethodId: string | undefined;

      // Process first payment without redirect
      await axios.post("/api/stripe/update-payment-intent", {
        paymentIntentId: paymentIntents[0].clientSecret.split("_secret")[0],
        customerId: customerData.customerId,
      });

      const firstPaymentResult = await stripe.confirmPayment({
        elements,
        clientSecret: paymentIntents[0].clientSecret,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              email: userEmail,
            },
          },
          save_payment_method: true,
        },
        redirect: "if_required",
      });

      if (firstPaymentResult.error) {
        throw firstPaymentResult.error;
      }

      // If there's only one payment, redirect now
      if (paymentIntents.length === 1) {
        window.location.href = `${window.location.origin}/`;
        return;
      }

      // Get the payment method ID from the first payment
      const { data: paymentData } = await axios.post(
        "/api/stripe/get-payment-intent",
        {
          paymentIntentId: paymentIntents[0].clientSecret.split("_secret")[0],
        }
      );

      paymentMethodId = paymentData.paymentMethodId;

      if (!paymentMethodId) {
        throw new Error("No payment method available");
      }

      // Process remaining payments
      for (let i = 1; i < paymentIntents.length; i++) {
        await axios.post("/api/stripe/update-payment-intent", {
          paymentIntentId: paymentIntents[i].clientSecret.split("_secret")[0],
          customerId: customerData.customerId,
        });

        const { error } = await stripe.confirmCardPayment(
          paymentIntents[i].clientSecret,
          {
            payment_method: paymentMethodId,
          }
        );

        if (error) {
          throw error;
        }
      }

      // All payments successful, redirect
      window.location.href = `${window.location.origin}/chat`;
      setMessage("Payment successful");
    } catch (error: any) {
      setMessage(`Payment failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
    defaultValues: {
      billingDetails: {
        email: userEmail,
      },
    },
  };

  const totalAmount = paymentIntents.reduce(
    (sum, intent) => sum + intent.totalAmount,
    0
  );

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Complete Payment</h3>
        <p className="text-sm text-gray-600">
          Total amount: ${(totalAmount / 100).toFixed(2)}
        </p>
      </div>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        className={`${OutfitFont.className} hover:bg-green-900 text-black w-full hover:text-white shadow-md hover:shadow-lg bg-green-300 mt-2`}
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
