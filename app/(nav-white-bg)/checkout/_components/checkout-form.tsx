"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import PaymentComponent from "../payment-component";
import axios from "axios";
import { Outfit } from "next/font/google";
import { JsonValue } from "@prisma/client/runtime/library";
import { UserRole } from "@prisma/client";

// Define CartItem type
interface CartItem {
  id: string;
  quantity: number;
  listing: {
    id: string;
    title: string;
    price: number;
    reports: number;
    stock: number;
    SODT: number | null;
    quantityType: string | null;
    shelfLife: number;
    rating: number[];
    createdAt: string;
    location: {
      type: string;
      coordinates: number[];
      address: string[];
      hours: JsonValue;
    };
    imageSrc: string[];
    userId: string;
    subCategory: string;
    minOrder: number;
    user: {
      id: string;
      SODT: number | null;
      name: string;
      role: UserRole;
    };
  };
}
[];

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

// Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is defined
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormProps {
  cartItems: CartItem[];
}

interface OrderTotals {
  [coopId: string]: number;
}

export default function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const user = useCurrentUser();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate item totals
  const itemTotals = cartItems.map(
    (cartItem: CartItem) => cartItem.quantity * cartItem.listing.price
  );

  // Ensure total is not NaN or undefined
  const total = itemTotals.reduce((acc: number, item: number) => acc + item, 0);
  const formattedTotal = total > 0 ? Round(total, 2) : 0;

  useEffect(() => {
    const fetchPaymentIntents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const orderIds = await sessionStorage.getItem("ORDER");
        if (!orderIds) {
          throw new Error("No order IDs found");
        }

        const orderTotals = cartItems.reduce(
          (acc: OrderTotals, cartItem: CartItem) => {
            const coopId = cartItem.listing.userId;
            if (!acc[coopId]) {
              acc[coopId] = 0;
            }
            acc[coopId] += cartItem.listing.price * cartItem.quantity * 100;
            return acc;
          },
          {}
        );

        let totalSum = Object.values(orderTotals).reduce(
          (sum, value) => sum + value,
          0
        );

        const response = await axios.post("/api/stripe/create-payment-intent", {
          totalSum,
          userId: user?.id,
          orderTotals,
          email: user?.email,
          orderIds,
        });

        const clientSecret = response.data.clientSecret;
        setClientSecret(clientSecret);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching payment intents:", error);
        setError("Failed to load checkout. Please try refreshing the page.");
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPaymentIntents();
    } else {
      setIsLoading(false);
    }
  }, [cartItems, user]);

  function Round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  if (isLoading) {
    return (
      <div
        className={`${outfit.className} flex items-center justify-center h-screen`}
      >
        <p className="text-xl">Loading checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${outfit.className} flex items-center justify-center h-screen`}
      >
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${outfit.className} flex items-center justify-center h-screen`}
      >
        <p className="text-xl">Please log in to access the checkout.</p>
      </div>
    );
  }

  return (
    <div className="">
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className={`${outfit.className} bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16`}
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {cartItems.map((cartItem: CartItem) => {
                const itemTotal = cartItem.quantity * cartItem.listing.price;
                return (
                  <li
                    key={cartItem.id}
                    className="flex items-start space-x-4 py-6"
                  >
                    <Image
                      src={cartItem.listing.imageSrc[0]}
                      alt={cartItem.listing.title}
                      width={80}
                      height={80}
                      className="h-20 w-20 flex-none rounded-md object-cover object-center"
                      priority={true}
                    />
                    <div className="flex-auto space-y-1">
                      <h3>{cartItem.listing.title}</h3>
                      <p className="text-gray-500">
                        {cartItem.listing.user.name}
                      </p>
                      <p className="text-gray-500">
                        {cartItem.quantity} {cartItem.listing.quantityType}
                      </p>
                    </div>
                    <p className="flex-none text-base font-medium">
                      ${itemTotal}
                    </p>
                  </li>
                );
              })}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>${formattedTotal}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Processing Fees</dt>
                <dd>$0.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>$0.00</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${formattedTotal}</dd>
              </div>
            </dl>

            <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
              <div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
                <div className="mx-auto max-w-lg">
                  <Popover.Button className="flex w-full items-center py-6 font-medium">
                    <span className="mr-auto text-base">Total</span>
                    <span className="mr-2 text-base">${formattedTotal}</span>
                    <ChevronUpIcon
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  </Popover.Button>
                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div>
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                  >
                    <Popover.Panel className="relative bg-white px-4 py-6 sm:px-6">
                      <dl className="mx-auto max-w-lg space-y-6">
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Subtotal</dt>
                          <dd>${formattedTotal}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Taxes</dt>
                          <dd>$0.00</dd>
                        </div>
                      </dl>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </Popover>
          </div>
        </section>

        <div className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {clientSecret ? (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <PaymentComponent />
              </Elements>
            ) : (
              <div className={`${outfit.className} text-center`}>
                <p className="text-xl">
                  Payment processing is being set up. Please wait...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
