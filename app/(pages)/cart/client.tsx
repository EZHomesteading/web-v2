"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import { SafeListing } from "@/types";
import { addDays, format } from "date-fns";

import axios from "axios";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderCreate from "@/app/components/order-create";

interface CartProps {
  cartItems?: any;
  user?: any;
}

const Cart = ({ cartItems, user }: CartProps) => {
  const total = cartItems.reduce(
    (acc: number, cartItem: any) => acc + cartItem.price * cartItem.quantity,
    0
  );
  //const router = useRouter();
  const shelfLife = (listing: SafeListing) => {
    const adjustedListing = {
      ...listing,
      createdAt: new Date(listing.createdAt),
      endDate:
        listing.shelfLife !== -1
          ? addDays(new Date(listing.createdAt), listing.shelfLife)
          : null,
    };

    const shelfLifeDisplay = adjustedListing.endDate
      ? `Estimated Expiry Date: ${format(
          adjustedListing.endDate,
          "MMM dd, yyyy"
        )}`
      : "This product is non-perisable";
    return shelfLifeDisplay;
  };

  return (
    <>
      <div className="bg-white">
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {cartItems?.map((cartItem: any) => (
                  <li key={cartItem.listing.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <Image
                        src={cartItem.listing.imageSrc}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                        width={100}
                        height={100}
                        alt={cartItem.listing.title}
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={`listings/${cartItem.listing.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {cartItem.listing.title}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <div className="text-gray-500">
                              {cartItem.listing.quantityType ? (
                                <div>
                                  {cartItem.listing.stock}
                                  {""}
                                  {cartItem.listing.quantityType} in stock
                                </div>
                              ) : (
                                `${cartItem.listing.stock} in stock`
                              )}
                            </div>
                            {cartItem.listing.shelfLife ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                {shelfLife(cartItem.listing)}
                              </p>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm font-medium text-gray-900">
                            ${cartItem.listing.price}{" "}
                            {cartItem.listing.quantityType ? (
                              <div> per {cartItem.listing.quantityType}</div>
                            ) : (
                              `per ${cartItem.listing.subCategory}`
                            )}
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${cartItem.listing}`}
                            className="sr-only"
                          >
                            Quantity, {cartItem.listing.title}
                          </label>
                          <select
                            id={`quantity-${cartItem.listing}`}
                            name={`quantity-${cartItem.listing}`}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                          </select>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              onClick={async () => {
                                await axios.delete(
                                  `/api/cart/${cartItem.listing.id}`
                                );
                                //router.refresh();
                              }}
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIconMini
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        {cartItem.listing.stock ? (
                          <CheckIcon
                            className="h-5 w-5 flex-shrink-0 text-green-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <ClockIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-300"
                            aria-hidden="true"
                          />
                        )}

                        <span>
                          {cartItem.listing.stock
                            ? "In stock"
                            : `None in Stock`}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${total}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax Estimate</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Learn more about how tax is calculated
                      </span>
                      <QuestionMarkCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">$0.00</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>EZH Processing Fees Always</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Learn more about how tax is calculated
                      </span>
                      <QuestionMarkCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">$0.00</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${total}
                  </dd>
                </div>
              </dl>
            </section>
          </form>
          <div className="mt-6">
            {/* <Link href="/checkout"> */}
            <OrderCreate cartItems={cartItems} />
            {/* </Link> */}
          </div>
        </main>
      </div>
    </>
  );
};
export default Cart;
