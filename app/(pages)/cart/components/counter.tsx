"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "react-datetime-picker/dist/DateTimePicker.css";

interface QuantityProps {
  cartItems?: any;
  cartItem?: any;
  onDataChange: any;
}

const SpCounter = ({ cartItems, cartItem, onDataChange }: QuantityProps) => {
  const [total, setTotal] = useState(false);
  const [hover, setHover] = useState(false);
  const [inputValue, setInputValue] = useState(cartItem.quantity);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const hoverOn = () => {
    setHover(true);
  };
  const hoverOff = () => {
    setHover(false);
    if (
      inputValue === "" ||
      inputValue === null ||
      inputValue === undefined ||
      isNaN(inputValue)
    ) {
      setQuantity(cartItem.listing.minOrder);
      cartItem.quantity = cartItem.listing.minOrder;
      setInputValue(cartItem.listing.minOrder);
      axios.post(`api/cartUpdate/`, {
        cartId: cartItem.id,
        quantity: cartItem.listing.minOrder,
      });
      return;
    }
    axios.post(`api/cartUpdate/`, {
      cartId: cartItem.id,
      quantity: parseInt(inputValue),
    });
  };

  const increment = () => {
    if (quantity < cartItem.listing.stock) {
      setInputValue(quantity + 1);
      setQuantity((prevQuantity: number) => Math.min(prevQuantity + 1));
      cartItem.quantity = quantity + 1;
    }
  };

  const decrement = async () => {
    if (cartItem.listing.minOrder === null) {
      if (quantity !== 1) {
        setInputValue(quantity - 1);
        cartItem.quantity = quantity - 1;
      }
      setQuantity((prevQuantity: number) => Math.max(prevQuantity - 1, 1));
    } else {
      if (quantity !== cartItem.listing.minOrder) {
        setInputValue(quantity - 1);
        cartItem.quantity = quantity - 1;
      }
      setQuantity((prevQuantity: number) =>
        Math.max(prevQuantity - 1, cartItem.listing.minOrder)
      );
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update the input value state
    setInputValue(newValue);

    // If the input value is empty, reset the quantity to 1
    if (hover === false && newValue === "") {
      setQuantity(cartItem.listing.minOrder);
      cartItem.quantity = cartItem.listing.minOrder;
      setInputValue(cartItem.listing.minOrder);
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
        setQuantity(newQuantity > maxQuantity ? maxQuantity : newQuantity);

        //setQuantity(quantity);
        setInputValue(newQuantity > maxQuantity ? maxQuantity : newQuantity);

        cartItem.quantity =
          newQuantity > maxQuantity ? maxQuantity : newQuantity;
      } else if (newQuantity < 1) {
        setQuantity(1);
        setInputValue(1);
        cartItem.quantity = 1;
      } else {
        setQuantity(newQuantity);
        setInputValue(newQuantity);
        cartItem.quantity = newQuantity;
      }
    }
  };
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (acc: number, cartItem: any) => acc + cartItem.price * cartItem.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems, hover, quantity]);
  useEffect(() => {
    onDataChange(total);
  }, [total, onDataChange]);

  return (
    <>
      <div className="flex flex-row gap-x-2 min-w-fit border-[1px] items-center border-gray-500 shadow-md rounded-lg w-fit px-1 sm:mt-2">
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
    </>
  );
};

export default SpCounter;
