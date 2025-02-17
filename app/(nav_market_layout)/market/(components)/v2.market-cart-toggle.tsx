"use client";
import { useBasket } from "@/hooks/listing/use-basket";
import Toast from "@/components/ui/toast";
import Link from "next/link";
import { PiBasketThin } from "react-icons/pi";
import HoursWarningModal from "./cartHoursWarning";
import { useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface DateCompatibility {
  date: string;
  compatible: boolean;
  overlapHours: number;
}

interface CartToggleProps {
  listing: any;
  user: User | null | undefined;
  onCartUpdate?: (inCart: boolean, quantity: number) => void;
  isInBasket: boolean;
  onBasketUpdate: (newState: boolean) => void;
}

const MarketCartToggle = ({
  user,
  listing,
  isInBasket,
  onBasketUpdate,
}: CartToggleProps) => {
  const {
    isLoading,
    toggleBasket,
    showWarning,
    setShowWarning,
    incompatibleDays,
    addToBasket,
  } = useBasket({
    listingId: listing?.id,
    user,
    initialQuantity: listing?.minOrder || 1,
    hours: listing?.location?.hours,
    onBasketUpdate: onBasketUpdate,
  });

  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      Toast({
        message: "Please sign in to add items to your basket",
        details: (
          <Link
            href={`/auth/login?callbackUrl=/listings/${listing?.Id}`}
            className={`text-sky-400 underline font-light`}
          >
            Sign in here
          </Link>
        ),
      });
      return;
    }

    try {
      await toggleBasket(e, isInBasket, "ACTIVE");
    } catch (error) {
      Toast({ message: "Failed to update basket" });
    }
  };

  return (
    <>
      <div className={`absolute top-3 right-3`}>
        <button
          disabled={isLoading}
          onClick={handleToggleBasket}
          className={`w-8 rounded-full aspect-square h-8 border flex items-center justify-center shadow-xl ${
            isInBasket ? "bg-red-400 hover:bg-red-500" : "bg-black/30"
          }`}
        >
          <PiBasketThin
            className="text-white"
            size={20}
            style={{
              filter: "drop-shadow(10px 10px 5px black)",
              strokeWidth: 1.5,
            }}
          />
        </button>
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

export default MarketCartToggle;
