"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderCreate from "@/app/components/order-create";
import Button from "@/app/components/Button";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
interface CartProps {
  cartItems?: any;
  user?: any;
}

const Cart = ({ cartItems, user }: CartProps) => {
  const [total, setTotal] = useState(
    cartItems.reduce(
      (acc: number, cartItem: any) => acc + cartItem.price * cartItem.quantity,
      0
    )
  );
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
    await axios.delete(`/api/cart`);
    router.refresh();
  };
  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (acc: number, cartItem: any) =>
          acc + cartItem.price * cartItem.quantity,
        0
      )
    );
    console.log(cartItems);
  }),
    [cartItems];
  return (
    <>
      <div className="bg-white">
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <Button label="Clear Cart" onClick={handleDelete}></Button>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {cartItems.map((cartItem: any, index: any) => {
                  const [hover, setHover] = useState(false);
                  const [inputValue, setInputValue] = useState(
                    cartItem.quantity
                  );
                  const hoverOn = () => {
                    setHover(true);
                    setInputValue(quantity);
                  };
                  const hoverOff = () => {
                    setHover(false);
                    setInputValue(quantity);
                  };
                  const [selectedDateTime, setSelectedDateTime] = useState(
                    new Date("2023-04-16T12:00:00")
                  );

                  const handleDateTimeChange = (date: any) => {
                    setSelectedDateTime(date);
                  };
                  const prevCartItem = cartItems[index - 1];
                  const [quantity, setQuantity] = useState(cartItem.quantity);

                  const increment = () => {
                    if (quantity < cartItem.listing.stock) {
                      setInputValue(quantity + 1);
                      setQuantity((prevQuantity: number) =>
                        Math.min(prevQuantity + 1)
                      );
                      cartItem.quantity = quantity + 1;
                    }
                  };

                  const decrement = async () => {
                    if (quantity !== 1) {
                      setInputValue(quantity - 1);
                      cartItem.quantity = quantity - 1;
                    }
                    setQuantity((prevQuantity: number) =>
                      Math.max(prevQuantity - 1, 1)
                    );
                  };

                  const handleQuantityChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const newValue = e.target.value;

                    // Update the input value state
                    setInputValue(newValue);

                    // If the input value is empty, reset the quantity to 1
                    if (hover === false && newValue === "") {
                      setQuantity(1);
                      cartItem.quantity = 1;
                      setInputValue(1);
                    }
                    if (hover === false && newValue > cartItem.listing.stock) {
                      setQuantity(cartItem.listing.stock);
                      cartItem.quantity = cartItem.listing.stock;
                      setInputValue(cartItem.listing.stock);
                    }
                    const maxQuantity = cartItem.listing.stock;
                    const newQuantity = parseInt(newValue, 10);
                    if (!isNaN(newQuantity)) {
                      if (newQuantity > maxQuantity) {
                        // If the new quantity is greater than the maximum allowed, set it to the maximum
                        setQuantity(
                          newQuantity > maxQuantity ? maxQuantity : newQuantity
                        );

                        //setQuantity(quantity);
                        setInputValue(
                          newQuantity > maxQuantity ? maxQuantity : newQuantity
                        );

                        cartItem.quantity =
                          newQuantity > maxQuantity ? maxQuantity : newQuantity;
                        if (hover === false) {
                          axios.post(`api/cartUpdate/`, {
                            cartId: cartItem.id,
                            quantity:
                              newQuantity > maxQuantity
                                ? maxQuantity
                                : newQuantity,
                          });
                        }
                      }
                      if (newQuantity < 1) {
                        setQuantity(1);
                        setInputValue(1);

                        cartItem.quantity = 1;
                        if (hover === false) {
                          axios.post(`api/cartUpdate/`, {
                            cartId: cartItem.id,
                            quantity: 1,
                          });
                        }
                      }
                    }
                  };
                  useEffect(() => {
                    axios.post(`api/cartUpdate/`, {
                      cartId: cartItem.id,
                      quantity: inputValue,
                    });
                  }, [hover]);

                  return (
                    <div>
                      {prevCartItem?.listing.userId !==
                      cartItem.listing.userId ? (
                        <li className="flex justify-evenly outline-none border-t-[2px]  border-gray-200 pt-4">
                          <p>{cartItem.listing.user.name}</p>
                          <DateTimePicker
                            className="text-black mt-2 w-5 outline-none"
                            onChange={handleDateTimeChange}
                            value={selectedDateTime}
                            disableClock={true} // Optional, to disable clock selection
                            clearIcon={null} // Optional, to remove the clear icon
                            calendarIcon={null} // Optional, to remove the calendar icon
                          />
                        </li>
                      ) : null}
                      <li
                        key={cartItem.listing.id}
                        className="flex py-6 sm:py-10"
                      >
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
                                  <div>
                                    {" "}
                                    per {cartItem.listing.quantityType}
                                  </div>
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
                              <div className="flex flex-row gap-x-2 min-w-fit border-[1px] items-center border-gray-500 shadow-md rounded-lg w-fit px-1">
                                <button
                                  onMouseEnter={hoverOn}
                                  onMouseLeave={hoverOff}
                                  type="button"
                                  className=""
                                  onClick={decrement}
                                >
                                  -
                                </button>
                                <input
                                  onFocus={hoverOn}
                                  onBlur={hoverOff}
                                  value={inputValue}
                                  onChange={handleQuantityChange}
                                  className="max-w-[40px]  text-center"
                                />
                                <button
                                  onMouseEnter={hoverOn}
                                  onMouseLeave={hoverOff}
                                  type="button"
                                  className=""
                                  onClick={increment}
                                >
                                  +
                                </button>
                              </div>

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
                    ${Round(total, 2)}
                  </dd>
                </div>
              </dl>
            </section>
          </form>
          <div className="mt-6">
            <OrderCreate cartItems={cartItems} />
          </div>
        </main>
      </div>
    </>
  );
};
export default Cart;
