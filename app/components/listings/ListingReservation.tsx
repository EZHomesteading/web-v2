"use client";

import { addDays, format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import useCartListing from "@/hooks/listing/use-cart-listing";
import { useState } from "react";

interface ListingReservationProps {
  listingId: string;
  user?: any | null;
  product: {
    endDate: Date | null;
    title: string | null;
    shelfLife: number;
    imageSrc: string | null;
    createdAt: Date;
    description: string;
    price: number | null;
    quantityType: string | null;
    stock: number | null;
  };
  onSubmit: () => void;
  disabled?: boolean;
  toggleCart: any;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  product,
  onSubmit,
  disabled,
  listingId,
  user,
  toggleCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { hasCart } = useCartListing({
    listingId,
    user,
    quantity,
  });
  const description = product.description;
  const stock = product.stock;
  const quantityType = product.quantityType;
  const price = product.price;
  const startDate = product.createdAt;
  const endDate =
    product.shelfLife !== -1
      ? addDays(new Date(startDate), product.shelfLife)
      : null;
  const endDateString = endDate
    ? format(endDate, "MMM dd, yyyy")
    : "No expiry date";

  const increaseQuantity = () => {
    if (product.stock && quantity < product.stock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleToggleCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await toggleCart(e, quantity);
  };
  return (
    <>
      <div
        className="
        bg-white 
        rounded-xl 
        border-[1px]
        border-neutral-200 
        overflow-hidden
        gap-1 
        p-2
      "
      >
        <div
          className="
      text-lg font-light text-neutral-500 p-2"
        >
          {description}
        </div>
        <hr />
        <div className="flex flex-row items-center p-2">
          {stock}
          {""} {quantityType} remaining at ${price}
          {quantityType && (
            <div className="font-light pl-[5px]">per {quantityType}</div>
          )}
        </div>
        <hr />
        <div className="p-2">Expected Expiry Date: {endDateString}</div>
        {!hasCart ? (
          <div className="flex flex-row items-center gap-2">
            <div
              className="flex items-center bg-gray-200 rounded-full px-4 py-2"
              style={{ width: "fit-content" }}
            >
              <button
                className="text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  decreaseQuantity();
                }}
              >
                -
              </button>
              <input
                className="bg-transparent text-center appearance-none outline-none"
                value={quantity}
                min={1}
                max={product.stock ?? undefined}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (
                    !isNaN(value) &&
                    value >= 1 &&
                    value <= (product.stock ?? Infinity)
                  ) {
                    setQuantity(value);
                  }
                }}
                style={{
                  WebkitAppearance: "textfield",
                  MozAppearance: "textfield",
                  appearance: "textfield",
                  width: "40px",
                }}
              />
              <button
                className="text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  increaseQuantity();
                }}
              >
                +
              </button>
            </div>

            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleToggleCart(e)
              }
              className="w-full bg-green-400 shadow-xl mb-[2px]"
            >
              {hasCart ? `Added to Cart` : "Add to Cart"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleToggleCart(e)
            }
            className="w-full bg-green-400 mb-[2px]"
          >
            {hasCart ? `Added to Cart` : "Add to Cart"}
          </Button>
        )}

        <Button
          disabled={disabled}
          onClick={onSubmit}
          className="w-full mt-1 bg-green-400 hover:bg-green-700"
        >{`Buy Now`}</Button>
      </div>
    </>
  );
};

export default ListingReservation;
