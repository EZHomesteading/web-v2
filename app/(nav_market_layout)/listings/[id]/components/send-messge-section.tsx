"use client";

import { Input } from "@/components/ui/input";
import { Location } from "@prisma/client";
import { UserInfo } from "next-auth";
import { useState, useEffect } from "react";
import Toast from "@/components/ui/toast";
import Link from "next/link";
import { useBasket } from "@/hooks/listing/use-basket";
import HoursWarningModal from "@/app/(nav_market_layout)/market/(components)/cartHoursWarning";

interface p {
  listing: any;
  user?: UserInfo;
  locations: Location[] | null;
  basketItemIds?: Array<{ listingId: string; id: string }> | null;
}

const SendMessageSection = ({ listing, user, locations, basketItemIds }: p) => {
  const [quantity, setQuantity] = useState(listing.minOrder || 1);

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
    basketItemIds,
  });

  const isInBasket =
    Array.isArray(basketItemIds) &&
    basketItemIds.some((item) => item?.listingId === listing.id);

  // Handle quantity changes
  const handleQuantityChange = (newValue: string) => {
    const parsedValue = parseInt(newValue, 10);
    const validValue = Math.min(
      Math.max(parsedValue, listing.minOrder || 1),
      listing?.stock || Infinity
    );
    setQuantity(validValue);
    if (isInBasket) {
      updateQuantity(validValue);
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

    try {
      await toggleBasket(e, isInBasket, "ACTIVE", quantity);
    } catch (error) {
      Toast({ message: "Failed to update basket" });
    }
  };

  // Update quantity in basket when component mounts or basket state changes
  useEffect(() => {
    if (isInBasket) {
      updateQuantity(quantity);
    }
  }, [isInBasket, quantity]);

  return (
    <>
      <div className="border shadow-sm mt-3 rounded-md h-fit pb-6 pt-2 px-2">
        <div className="text-xl font-semibold">Add to your Basket</div>
        <p className="pb-4">
          ${listing.price} per {listing.quantityType}
        </p>

        <div className="p-0 relative hover:cursor-pointer rounded-md border border-custom h-14">
          <div className="absolute top-1 text-xs text-neutral-700 left-1 font-medium">
            Quantity
          </div>
          <Input
            className="w-full focus-visible:ring-0 border-none p-8 pl-2 font-semibold"
            type="number"
            maxLength={6}
            max={listing?.stock}
            inputMode="numeric"
            min={listing.minOrder || 1}
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
          />
        </div>
        <button
          onClick={handleToggleBasket}
          disabled={isLoading}
          className={`w-full mt-4 rounded-md p-4 text-lg font-semibold shadow-sm ${
            isInBasket ? "bg-red-400 text-white hover:bg-red-500" : "bg-sky-100"
          }`}
        >
          {isInBasket
            ? "Remove from Basket"
            : `Add ${quantity ? quantity : 0} ${
                listing?.quantityType
              } to Basket`}
        </button>

        <div className="text-xs text-center mt-3">
          You will not be charged at this time
        </div>
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
