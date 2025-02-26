"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { OutfitFont } from "@/components/fonts";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import PaymentComponent from "./payment-component";
import axios from "axios";
import { getUserById } from "@/actions/getUser";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormProps {
  baskets: any[];
  userId: string;
  userLoc: any;
  userEmail: string;
}

interface PaymentIntentData {
  clientSecret: string;
  basketId: string;
  totalAmount: number;
}

const MobilePriceSummary = ({ formattedTotal }: { formattedTotal: number }) => {
  return (
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
              </dl>
            </Popover.Panel>
          </Transition.Child>
        </div>
      </Transition.Root>
    </Popover>
  );
};

export default function CheckoutForm({
  baskets,
  userId,
  userLoc,
  userEmail,
}: CheckoutFormProps) {
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateTotals = () => {
    return baskets.reduce((acc, basket) => {
      const basketTotal = basket.items.reduce(
        (sum: number, item: any) => sum + item.listing.price * item.quantity,
        0
      );
      return acc + basketTotal;
    }, 0);
  };

  const total = calculateTotals();
  const formattedTotal = Round(total, 2);

  useEffect(() => {
    const fetchPaymentIntents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const intents: PaymentIntentData[] = [];

        for (const basket of baskets) {
          const basketTotal = basket.items.reduce(
            (sum: number, item: any) =>
              sum + item.listing.price * item.quantity * 100,
            0
          );

          const sellerId = basket.location.user.id;
          const basketTotals = { [sellerId]: basketTotal };
          const sellerResponse = await fetch(`/api/users/${sellerId}`);

          if (!sellerResponse.ok) {
            throw new Error(
              `Failed to fetch user: ${sellerResponse.statusText}`
            );
          }

          const seller = await sellerResponse.json();
          const sellerStripeID = seller?.stripeAccountId;
          console.log(sellerStripeID);
          const response = await axios.post(
            "/api/stripe/create-payment-intent",
            {
              totalSum: basketTotal,
              basketTotals,
              userId,
              basketIds: [basket.id],
              userLoc,
              sellerStripeID,
              orderGroupId: new URLSearchParams(window.location.search).get(
                "orderGroupId"
              ),
              metadata: {
                basketId: basket.id,
              },
            }
          );

          intents.push({
            clientSecret: response.data.clientSecret,
            basketId: basket.id,
            totalAmount: basketTotal,
          });
        }

        setPaymentIntents(intents);
      } catch (error) {
        console.error("Error creating payment intents:", error);
        setError(
          "Failed to initialize checkout. Please try refreshing the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (baskets.length > 0) {
      fetchPaymentIntents();
    }
  }, [baskets, userId, userLoc]);

  function Round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  if (isLoading) {
    return (
      <div
        className={`${OutfitFont.className} flex items-center justify-center h-screen`}
      >
        <p className="text-xl">Loading checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${OutfitFont.className} flex items-center justify-center h-screen`}
      >
        <p className="text-xl text-red-500">{error}</p>
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
          className={`${OutfitFont.className} bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16`}
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <div className="space-y-8">
              {baskets.map((basket) => (
                <div key={basket.id} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-base font-semibold">
                        {basket.location.displayName ||
                          basket.location.user.name}
                      </h3>
                      <span className="text-sm text-gray-600">
                        $
                        {basket.items
                          .reduce(
                            (sum: number, item: any) =>
                              sum + item.listing.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      {basket.orderMethod === "PICKUP" && basket.pickupDate ? (
                        <div className="text-xs sm:text-sm">
                          Pickup set for{" "}
                          {formatDate(new Date(basket.pickupDate))}
                        </div>
                      ) : basket.orderMethod === "DELIVERY" &&
                        basket.deliveryDate ? (
                        <div className="text-xs sm:text-sm">
                          Delivery scheduled for{" "}
                          {formatDate(new Date(basket.deliveryDate))}
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm text-yellow-600">
                          No pickup/delivery time set
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="divide-y divide-gray-100">
                    {basket.items.map((item: any) => (
                      <li key={item.id} className="flex py-4 gap-4">
                        <div className="h-20 w-20 flex-none relative">
                          <Image
                            src={item.listing.imageSrc[0]}
                            alt={item.listing.title}
                            fill
                            className="rounded-md object-cover"
                            sizes="80px"
                            priority={true}
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-4">
                            <div>
                              <h4 className="font-medium">
                                {item.listing.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.quantity}{" "}
                                {item.listing.quantityType ||
                                  item.listing.subCategory}
                              </p>
                            </div>
                            <p className="text-sm font-medium">
                              ${(item.quantity * item.listing.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base">Total</dt>
              <dd className="text-base">${formattedTotal}</dd>
            </div>
          </div>
        </section>

        <div className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {paymentIntents.length > 0 ? (
              <Elements
                options={{
                  clientSecret: paymentIntents[0].clientSecret,
                }}
                stripe={stripePromise}
              >
                <PaymentComponent
                  userEmail={userEmail}
                  paymentIntents={paymentIntents}
                />
              </Elements>
            ) : (
              <div className={`${OutfitFont.className} text-center`}>
                <p className="text-xl">
                  Payment processing is being set up. Please wait...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobilePriceSummary formattedTotal={formattedTotal} />
    </div>
  );
}

const formatDate = (date: Date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const daySuffix =
    day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${dayName}, ${monthName} ${day}${daySuffix}, at ${formattedHours}:${formattedMinutes}${amPm}`;
};
