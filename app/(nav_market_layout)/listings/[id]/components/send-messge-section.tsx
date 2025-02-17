"use client";

import { UserInfo } from "next-auth";
import { useRef, useState } from "react";
import Toast from "@/components/ui/toast";
import Link from "next/link";
import { useBasket } from "@/hooks/listing/use-basket";
import HoursWarningModal from "@/app/(nav_market_layout)/market/(components)/cartHoursWarning";
import { PiMinusBold, PiPencilThin, PiPlusBold } from "react-icons/pi";

interface p {
  listing: any;
  user?: UserInfo;
  onBasketUpdate: (newState: boolean) => void;
  isInBasket: boolean;
}

const SendMessageSection = ({
  isInBasket,
  listing,
  user,
  onBasketUpdate,
}: p) => {
  const [quantity, setQuantity] = useState(listing.minOrder || 1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusClick = () => {
    inputRef.current?.focus();
  };

  const {
    isLoading,
    toggleBasket,
    showWarning,
    setShowWarning,
    incompatibleDays,
    addToBasket,
    updateQuantity,
  } = useBasket({
    listingId: listing.id,
    user,
    initialQuantity: quantity,
    hours: listing?.location?.hours,
    onBasketUpdate: onBasketUpdate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "" || /^\d*$/.test(newValue)) {
      setQuantity(newValue);

      if (newValue !== "" && parseInt(newValue) > listing.stock) {
        setQuantity(listing.stock.toString());
      }
    }
  };
  const handleBlur = () => {
    setIsFocused(false);
    if (quantity === "") {
      setQuantity("0");
    }
  };

  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      Toast({
        message: "Please sign in to add items to your basket",
        details: (
          <Link
            href={`/auth/login?callbackUrl=/listings/${listing.id}`}
            className="text-sky-400 underline font-light"
          >
            Sign in here
          </Link>
        ),
      });
      return;
    }

    if (!quantity || typeof quantity === "string") {
      Toast({ message: "Quantity must be greater than 0" });
      return;
    }

    if (quantity < listing.minOrder) {
      Toast({
        message: `Quantity must be ${listing.minOrder} ${listing.quantityType} or more`,
      });
      return;
    }

    try {
      await toggleBasket(e, isInBasket, "ACTIVE", quantity);
    } catch (error) {
      Toast({ message: "Failed to update basket" });
    }
  };

  // useEffect(() => {
  //   if (isInBasket) {
  //     updateQuantity(quantity);
  //   }
  // }, [isInBasket, quantity]);

  const handleIncrement = () => {
    const newQuantity = Math.min(quantity + 1, listing.stock);
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(quantity - 1, 0);
    setQuantity(newQuantity);
  };

  return (
    <>
      <div className="border shadow-sm mt-3 rounded-md h-fit pb-6 pt-2 px-2">
        <div className="text-xl font-semibold">Add to your Basket</div>
        <p className={`${!isInBasket && "pb-4"} flex items-center gap-x-1`}>
          ${listing.price} per {listing.quantityType}{" "}
          <div className={`h-1 w-1 rounded-full bg-black`} />
          {listing.minOrder || 1} {listing.quantityType || ""} Minimum Order
        </p>
        {!isInBasket && (
          <div className="flex items-center justify-center space-x-4 relative">
            <button
              onClick={handleDecrement}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors borderBlack border-[2px]"
              disabled={quantity <= 0}
            >
              <PiMinusBold className="text-xl" />
            </button>

            <div className={`relative`}>
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                className="w-16 text-center border-none focus:outline-none relative focus:ring-0 text-3xl font-bold"
                value={quantity}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                maxLength={6}
              />
              {!isFocused && (
                <div>
                  <PiPencilThin
                    onClick={handleFocusClick}
                    className={`absolute right-1 bottom-0 bg-white rounded-full border hover:cursor-pointer`}
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleIncrement}
              className="p-1 hover:bg-gray-100 !border-black border-[2px] rounded-full transition-colors"
              disabled={quantity >= listing.stock}
            >
              <PiPlusBold className="text-xl" />
            </button>
          </div>
        )}
        <button
          onClick={handleToggleBasket}
          disabled={isLoading}
          className={`w-full mt-4 rounded-md p-4 text-lg font-semibold shadow-sm ${
            isInBasket ? "bg-red-400 text-white hover:bg-red-500" : "bg-sky-100"
          }`}
        >
          {isInBasket
            ? `Remove ${quantity ? quantity : 0} ${
                listing?.quantityType
              } from Basket`
            : `Add ${quantity ? quantity : 0} ${
                listing?.quantityType
              } to Basket`}
        </button>

        {!isInBasket && (
          <div className="text-xs text-center mt-3">
            You will not be charged at this time
          </div>
        )}
      </div>
      <HoursWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onConfirm={() => {
          setShowWarning(false);
          addToBasket("ACTIVE");
        }}
        incompatibleDays={incompatibleDays}
        type={listing?.location?.hours?.pickup ? "pickup" : "delivery"}
      />
    </>
  );
};

export default SendMessageSection;
