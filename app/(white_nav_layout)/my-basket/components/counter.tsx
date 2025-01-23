"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { BasketItem, useBasket } from "./DetailedBasketGrid";

interface QuantityProps {
  item: BasketItem;
  basketId: string;
}

const SpCounter = ({ item, basketId }: QuantityProps) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const updateServer = useCallback(
    debounce(async (newQuantity: number) => {
      try {
        await axios.post(`/api/baskets/update`, {
          id: basketId,
          items: [{ listingId: item.listing.id, quantity: newQuantity }],
        });
      } catch (error) {
        console.error("Error updating basket:", error);
      }
    }, 2000),
    [basketId, item.listing.id]
  );

  const handleQuantityChange = (newValue: number) => {
    if (newValue === localQuantity) return;
    const stock = item.listing.stock ?? Infinity;
    const minOrder = item.listing.minOrder ?? 1;
    const clampedQuantity = Math.min(Math.max(newValue, minOrder), stock);

    setLocalQuantity(clampedQuantity);
    item.quantity = clampedQuantity;
    updateServer(clampedQuantity);
  };

  return (
    <div>
      <div>Total Price: ${localQuantity * item.price}</div>
      <div className="flex flex-row gap-x-2 min-w-fit border-[1px] items-center border-gray-500 shadow-md rounded-lg w-fit px-1 sm:mt-2">
        <button
          type="button"
          className="p-2 touch-manipulation"
          onClick={() => handleQuantityChange(localQuantity - 1)}
        >
          -
        </button>
        <input
          value={localQuantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val)) handleQuantityChange(val);
          }}
          className="max-w-[40px] text-center"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          type="button"
          className="p-2 touch-manipulation"
          onClick={() => handleQuantityChange(localQuantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SpCounter;
