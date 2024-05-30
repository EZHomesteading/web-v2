"use client";
//very special counter component for cart page that sends all data everywhere it needs to be send and dynamically updates the total for the user to haev a nice experience
//handles typing into input fiels and user clickign plus and minus button, all while allowing and dynamically setting mins and maxes based on the listing they are attached to.
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
    // If the input value is invalid, reset the quantity to the minimum order
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

    // Update the quantity in the server
    axios.post(`api/cartUpdate/`, {
      cartId: cartItem.id,
      quantity: parseInt(inputValue),
    });
  };

  // Function to increment the quantity
  const increment = () => {
    // Check if the quantity can be increased
    if (quantity < cartItem.listing.stock) {
      setInputValue(quantity + 1);
      setQuantity((prevQuantity: number) =>
        Math.min(prevQuantity + 1, cartItem.listing.stock)
      );
      cartItem.quantity = quantity + 1;
    }
  };

  // Function to decrement the quantity
  const decrement = async () => {
    // Check if the minimum order is set
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

  // Function to handle changes in the input field
  const handleQuantityChange = (e: any) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // If the input is not in focus and the value is empty, reset to the minimum order
    if (hover === false && newValue === "") {
      setQuantity(cartItem.listing.minOrder);
      cartItem.quantity = cartItem.listing.minOrder;
      setInputValue(cartItem.listing.minOrder);
    }

    // If the input is not in focus and the value exceeds the stock, set to the maximum stock
    if (hover === false && newValue > cartItem.listing.stock) {
      setQuantity(cartItem.listing.stock);
      cartItem.quantity = cartItem.listing.stock;
      setInputValue(cartItem.listing.stock);
    }

    const maxQuantity = cartItem.listing.stock;
    const newQuantity = parseInt(newValue, 10);

    // If the new value is a valid number
    if (!isNaN(newQuantity)) {
      if (newQuantity > maxQuantity) {
        // If the new quantity exceeds the maximum allowed, set it to the maximum
        setQuantity(maxQuantity);
        setInputValue(maxQuantity);
        cartItem.quantity = maxQuantity;
      } else if (newQuantity < cartItem.listing.minOrder) {
        // If the new quantity is less than the minimum order, set it to the minimum order
        setQuantity(cartItem.listing.minOrder);
        setInputValue(cartItem.listing.minOrder);
        cartItem.quantity = cartItem.listing.minOrder;
      } else {
        // Update the quantity and input value
        setQuantity(newQuantity);
        setInputValue(newQuantity);
        cartItem.quantity = newQuantity;
      }
    }
  };

  // Calculate the total value based on the quantities of all cart items
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (acc: any, cartItem: any) =>
        acc + cartItem.listing.price * cartItem.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems, hover, quantity]);

  // send data to parent element whenever the total value changes
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
