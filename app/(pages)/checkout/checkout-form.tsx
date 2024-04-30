"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import PaymentComponent from "./payment-component";
import axios from "axios";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutFormProps {
  cartItems: any;
}

export default function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const user = useCurrentUser();
  const [clientSecret, setClientSecret] = useState("");
  const itemTotals = cartItems.map(
    (cartItem: any) => cartItem.quantity * cartItem.listing.price
  );

  const total = itemTotals.reduce((acc: number, item: number) => acc + item, 0);

  useEffect(() => {
    const fetchPaymentIntents = async () => {
      const orderIds = await sessionStorage.getItem("ORDER");
      if (orderIds === null) {
        window.location.reload();
      }
      if (orderIds === "") {
        window.location.reload();
      }
      const orderTotals = cartItems.reduce((acc: any, cartItem: any) => {
        const coopId = cartItem.listing.userId;
        if (!acc[coopId]) {
          acc[coopId] = 0;
        }
        acc[coopId] += cartItem.listing.price * cartItem.quantity * 100;
        return acc;
      }, {});
      let totalSum = 0;
      const acc = orderTotals;
      for (const coopId in acc) {
        if (acc.hasOwnProperty(coopId)) {
          totalSum += acc[coopId];
        }
      }

      try {
        const response = await axios.post("/api/stripe/create-payment-intent", {
          totalSum,
          userId: user?.id,
          orderTotals,
          email: user?.email,
          orderIds,
        });
        console.log("totalsum", totalSum);
        const clientSecret = response.data.clientSecret;
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error fetching payment intents:", error);
      }
    };

    fetchPaymentIntents();
  }, [cartItems, user?.email, user?.id]);
  return (
    <>
      {user ? (
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
              className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
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
                  {cartItems.map((cartItem: any) => {
                    const itemTotal =
                      cartItem.quantity * cartItem.listing.price;
                    return (
                      <li
                        key={cartItem.id}
                        className="flex listings-start space-x-4 py-6"
                      >
                        <Image
                          src={cartItem.listing.imageSrc}
                          alt={cartItem.listing.title}
                          width={80}
                          height={80}
                          className="h-20 w-20 flex-none rounded-md object-cover object-center"
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
                  <div className="flex listings-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd>${total}</dd>
                  </div>

                  <div className="flex listings-center justify-between">
                    <dt className="text-gray-600">Processing Fees</dt>
                    <dd>$0.00</dd>
                  </div>

                  <div className="flex listings-center justify-between">
                    <dt className="text-gray-600">Taxes</dt>
                    <dd>$0.00</dd>
                  </div>

                  <div className="flex listings-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base">Total</dt>
                    <dd className="text-base">${total}</dd>
                  </div>
                </dl>

                <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
                  <div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
                    <div className="mx-auto max-w-lg">
                      <Popover.Button className="flex w-full listings-center py-6 font-medium">
                        <span className="mr-auto text-base">Total</span>
                        <span className="mr-2 text-base">${total}</span>
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
                            <div className="flex listings-center justify-between">
                              <dt className="text-gray-600">Subtotal</dt>
                              <dd>${total}</dd>
                            </div>
                            <div className="flex listings-center justify-between">
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
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}
