"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import { SafeListing } from "@/types";
import { addDays, format } from "date-fns";

import axios from "axios";
import { useRouter } from "next/navigation";
import OrderCreate from "@/app/components/order-create";
import { Button } from "@/app/components/ui/button";
import "react-datetime-picker/dist/DateTimePicker.css";
import SpCounter from "@/app/(pages)/cart/components/counter";
import DateState from "@/app/(pages)/cart/components/dateStates";
import { ExtendedHours } from "@/next-auth";
import { UserInfo, CartGroups } from "@/next-auth";
import { BsTrash2 } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { Outfit } from "next/font/google";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});
interface CartProps {
  cartItems?: any;
  user?: UserInfo;
}

const Cart = ({ cartItems, user }: CartProps) => {
  const [validTime, setValidTime] = useState<any>();
  const [checkoutPickup, setCheckoutPickup] = useState<any>("");
  const [stillExpiry, setStillExpiry] = useState(true);
  const [total, setTotal] = useState(
    cartItems.reduce(
      (acc: number, cartItem: any) => acc + cartItem.price * cartItem.quantity,
      0
    )
  );

  const handleDataFromChild = (childTotal: any) => {
    setTotal(childTotal);
  };
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (acc: number, cartItem: any) => acc + cartItem.price * cartItem.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems, total]);

  function Round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const router = useRouter();
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
  const handleDelete: any = async () => {
    await axios.delete(`/api/cartUpdate`);
    router.refresh();
  };
  function convertToDate(dateString: string) {
    // Remove the leading text "Estimated Expiry Date: "
    const datePart = dateString.split(": ")[1];

    // Convert the date string to a Date object
    const dateObj = new Date(datePart);

    return dateObj;
  }
  const mappedCartItems: CartGroups = cartItems.reduce(
    (acc: any, cartItem: any, index: number) => {
      const expiry = convertToDate(shelfLife(cartItem.listing)); // Replace with the actual expiry date calculation
      const existingOrder = acc[acc.length - 1];
      const prevCartItem = cartItems[index - 1];

      if (
        existingOrder &&
        prevCartItem?.listing.userId === cartItem.listing.userId
      ) {
        if (existingOrder.expiry > expiry) {
          existingOrder.expiry = expiry;
        }
      }
      if (prevCartItem?.listing.userId !== cartItem.listing.userId) {
        acc.push({
          expiry,
          cartIndex: index,
        });
      }
      return acc;
    },
    []
  );
  function updateObjectWithCartIndex(arr: any, targetCartIndex: number) {
    let foundObject = null;

    arr.forEach((obj: any, index: number) => {
      if (obj.cartIndex === targetCartIndex) {
        arr[index].pickupTime = validTime.pickupTime;
        delete arr[index].expiry;
        foundObject = obj;
      }
    });
    //setCheckoutPickup(mappedCartItems);
    return arr;
  }
  useEffect(() => {
    console.log(checkoutPickup);
  }),
    [checkoutPickup];
  useEffect(() => {
    if (validTime) {
      if (checkoutPickup === "") {
        const initialPickupBuild = updateObjectWithCartIndex(
          mappedCartItems,
          validTime.index
        );
        setStillExpiry(
          initialPickupBuild.some((item: any) => !item.pickupTime)
        );
        console.log(stillExpiry);
        setCheckoutPickup(initialPickupBuild);
      } else {
        const updatePickupBuild = updateObjectWithCartIndex(
          checkoutPickup,
          validTime.index
        );
        setStillExpiry(updatePickupBuild.some((item: any) => !item.pickupTime));
        console.log(stillExpiry);
        setCheckoutPickup(updatePickupBuild);
        console.log(checkoutPickup);
      }
    }
  }),
    [validTime];
  const handleTime = (childTime: Date) => {
    setValidTime(childTime);
  };
  //console.log(mappedCartItems);
  function findObjectWithCartIndex(arr: any, targetCartIndex: number) {
    let foundObject = null;

    arr.forEach((obj: any) => {
      if (obj.cartIndex === targetCartIndex) {
        foundObject = obj;
      }
    });

    return foundObject;
  }

  return (
    <>
      <div className="bg-white">
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <header className="flex flex-row gap-x-2 items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Cart
            </h1>
            <Link
              href="/market"
              className="
              block 
            transition 
           cursor-pointer
           text-center bg-green-400 hover:bg-green-700 rounded-lg px-4 py-2 text-sm"
            >
              Continue Shopping
            </Link>
            <div className="justify-center">
              <Button
                className="bg-red-300 text-black hover:bg-red-600 hover:text-white hover:shadow-lg shadow-md"
                onClick={handleDelete}
              >
                <BsTrash2 className="text-lg mr-1" />
                Empty Cart
              </Button>
            </div>
          </header>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {cartItems.map((cartItem: any, index: any) => {
                  const prevCartItem = cartItems[index - 1];

                  return (
                    <div key={cartItem.listingId}>
                      {prevCartItem?.listing.userId !==
                      cartItem.listing.userId ? (
                        <li className="flex justify-between outline-none border-t-[2px]  border-gray-200 pt-4">
                          <p
                            className={`${outfit.className} text-2xl md:text-4xl`}
                          >
                            {cartItem.listing.user.name}
                          </p>
                          <DateState
                            hours={
                              cartItem?.listing.user.hours as ExtendedHours
                            }
                            onSetTime={handleTime}
                            index={index}
                            cartGroup={findObjectWithCartIndex(
                              mappedCartItems,
                              index
                            )}
                          />
                        </li>
                      ) : null}
                      <li
                        key={cartItem.listing.id}
                        className="flex py-3 sm:py-8"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={cartItem.listing.imageSrc[0]}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                            width={100}
                            height={100}
                            alt={cartItem.listing.title}
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link
                                    href={`listings/${cartItem.listing.id}`}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                  >
                                    {cartItem.listing.title}
                                  </Link>
                                </h3>
                              </div>
                              <div className="mt-1 flex text-sm flex-col sm:flex-row">
                                <div className="text-gray-500">
                                  {cartItem.listing.quantityType ? (
                                    <div className="flex flex-row">
                                      <span>{`${cartItem.listing.stock} ${cartItem.listing.quantityType} in stock`}</span>
                                    </div>
                                  ) : (
                                    <span>{`${cartItem.listing.stock} in stock`}</span>
                                  )}
                                </div>
                                {cartItem.listing.shelfLife && (
                                  <p className="sm:ml-4 sm:border-l border-none sm:border-gray-200 sm:pl-4 text-gray-500 text-xs sm:text-sm">
                                    {shelfLife(cartItem.listing)}
                                  </p>
                                )}
                              </div>
                              <div className="mt-1 text-sm font-medium text-gray-900 flex flex-row">
                                ${cartItem.listing.price}{" "}
                                {cartItem.listing.quantityType ? (
                                  <span className="ml-1">
                                    {" "}
                                    per {cartItem.listing.quantityType}
                                  </span>
                                ) : (
                                  <span className="ml-1">
                                    {" "}
                                    per {cartItem.listing.subCategory}
                                  </span>
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
                              <SpCounter
                                cartItem={cartItem}
                                cartItems={cartItems}
                                onDataChange={handleDataFromChild}
                              />

                              <div className="absolute right-0 top-0">
                                <button
                                  type="button"
                                  className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                  onClick={async () => {
                                    const cartId = cartItem.id;
                                    await axios.delete(`/api/cart/${cartId}`);
                                    router.refresh();
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
                            {cartItem.listing.stock > 0 ? (
                              <CheckIcon
                                className="h-5 w-5 flex-shrink-0 text-green-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <MdErrorOutline
                                className="h-5 w-5 flex-shrink-0 text-red-700"
                                aria-hidden="true"
                              />
                            )}

                            <span>
                              {cartItem.listing.stock > 0
                                ? "In stock"
                                : `None in Stock`}
                            </span>
                          </p>
                        </div>
                      </li>
                    </div>
                  );
                })}
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
                    ${Round(total, 2)}
                  </dd>
                </div>

                {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
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
                  <dd className="text-sm font-medium text-gray-900">
                    ${Round(total * 0.08, 2)}
                  </dd>
                </div> */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>EZH Processing Fees Always</span>
                    <Popover>
                      <PopoverTrigger>
                        <QuestionMarkCircleIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="absolute bottom-5">
                        There are no fees for EZH buyers
                      </PopoverContent>
                    </Popover>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">$0.00</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${Round(total, 2)}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <OrderCreate
                  cartItems={cartItems}
                  pickupArr={checkoutPickup}
                  stillExpiry={stillExpiry}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};
export default Cart;
