"use client";
import { useBasket } from "@/hooks/listing/use-basket";
import Toast from "@/components/ui/toast";
import Link from "next/link";
import { PiBasketThin } from "react-icons/pi";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface CartToggleProps {
  listing: any;
  user: User | null | undefined;
  isInBasket: boolean;
  onBasketUpdate: (newIsInBasket: boolean) => void;
}

const MarketCartToggle = ({
  listing,
  user,
  isInBasket,
  onBasketUpdate,
}: CartToggleProps) => {
  const listingId = listing?.id;
  const { isLoading, toggleBasket } = useBasket({
    listingId,
    user,
    initialQuantity: listing?.minOrder || 1,
  });

  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      Toast({
        message: "Please sign in to add items to your basket",
        details: (
          <Link
            href={`/auth/login?callbackUrl=/listings/${listingId}`}
            className={`text-sky-400 underline font-light`}
          >
            Sign in here
          </Link>
        ),
      });
      return;
    }

    try {
      onBasketUpdate(!isInBasket);
      await toggleBasket(e, isInBasket, "ACTIVE");
    } catch (error) {
      onBasketUpdate(isInBasket);
      Toast({ message: "Failed to update basket" });
    }
  };

  return (
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
  );
};

export default MarketCartToggle;
