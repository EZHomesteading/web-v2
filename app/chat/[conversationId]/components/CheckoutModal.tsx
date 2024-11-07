"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Outfit } from "next/font/google";
import Image from "next/image";
import axios from "axios";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { JsonValue } from "@prisma/client/runtime/library";
import { UserRole } from "@prisma/client";
import { ChatListing, ChatOrder } from "chat-types";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

// Stripe initialization
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface ListingQuantity {
  id: string;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: ChatListing[];
  order: ChatOrder | null;
  user: any;
  deliveryFee?: number | null;
}

const PaymentForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

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
    } else {
      setMessage("Payment successful");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        id="payment-element"
        options={{ layout: { type: "tabs", defaultCollapsed: false } }}
      />
      <Button
        className={`${outfit.className} hover:bg-green-900 text-black w-full hover:text-white shadow-md hover:shadow-lg bg-green-300 mt-2`}
        disabled={isLoading || !stripe || !elements}
      >
        Pay Now
      </Button>
      {message && <div className="mt-2 text-center text-sm">{message}</div>}
    </form>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  listings,
  order,
  user,
  deliveryFee,
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!order) return null;

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!order || !user || !isOpen) return;

      setIsLoading(true);
      try {
        // Calculate order items and total inside useEffect
        const calculatedOrderItems = order.quantity
          .map((quantityItem) => {
            const listing = listings.find((l) => l.id === quantityItem.id);
            if (!listing) return null;
            return {
              ...listing,
              orderQuantity: quantityItem.quantity,
            };
          })
          .filter(
            (item): item is ChatListing & { orderQuantity: number } =>
              item !== null
          );

        const subtotal = calculatedOrderItems.reduce(
          (acc, item) => acc + item.price * item.orderQuantity,
          0
        );

        // Add delivery fee from props
        const finalDeliveryFee = deliveryFee || 0;
        const total = subtotal + finalDeliveryFee;

        const paymentData = {
          totalSum: Math.round(total * 100), // Convert to cents
          userId: user.id,
          orderTotals: {
            [order.sellerId]: Math.round(total * 100),
          },
          body: {
            items: calculatedOrderItems.map((item) => ({
              title: item.title,
              quantity: item.orderQuantity,
              price: item.price,
            })),
            deliveryFee: finalDeliveryFee,
          },
          email: user.email,
          orderId: order.id,
        };

        const response = await axios.post(
          "/api/stripe/create-payment-intent",
          paymentData
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load checkout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [order?.id, user?.id, isOpen, listings, deliveryFee]);

  // Calculate these for rendering only
  const orderItems = order.quantity
    .map((quantityItem) => {
      const listing = listings.find((l) => l.id === quantityItem.id);
      if (!listing) return null;
      return {
        ...listing,
        orderQuantity: quantityItem.quantity,
      };
    })
    .filter(
      (item): item is ChatListing & { orderQuantity: number } => item !== null
    );

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.orderQuantity,
    0
  );

  const finalDeliveryFee = deliveryFee || 0;
  const total = subtotal + finalDeliveryFee;
  const formattedTotal = total > 0 ? Number(total.toFixed(2)) : 0;
  const formattedDeliveryFee =
    finalDeliveryFee > 0 ? Number(finalDeliveryFee.toFixed(2)) : 0;
  const formattedSubtotal = subtotal > 0 ? Number(subtotal.toFixed(2)) : 0;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl">
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Checkout
              </Dialog.Title>

              {isLoading ? (
                <div className="text-center py-8">Loading checkout...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Order Summary</h3>
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex space-x-4">
                          <Image
                            src={item.imageSrc[0]}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h4>{item.title}</h4>
                            <p className="text-sm text-gray-500">
                              {item.orderQuantity} {item.quantityType}
                            </p>
                            <p className="font-medium">
                              ${item.orderQuantity * item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${formattedSubtotal}</span>
                      </div>
                      {deliveryFee && deliveryFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Delivery Fee</span>
                          <span>${formattedDeliveryFee}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium text-lg pt-2">
                        <span>Total</span>
                        <span>${formattedTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div>
                    {clientSecret && (
                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret }}
                      >
                        <PaymentForm clientSecret={clientSecret} />
                      </Elements>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4 flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
export default CheckoutModal;
