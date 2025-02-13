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
  listingId: string;
  listing: any;
  user: User | null | undefined;
  initialQuantity?: number;
  stock?: number;
  minOrder?: number;
  basketItemIds?: Array<{ listingId: string; id: string }> | null;
  quantityType?: string;
  price: number;
  onCartUpdate?: (inCart: boolean, quantity: number) => void;
}

const MarketCartToggle = ({
  listingId,
  user,
  basketItemIds = [],
  minOrder,
}: CartToggleProps) => {
  const { isLoading, toggleBasket } = useBasket({
    listingId,
    user,
    initialQuantity: minOrder || 1,
  });

  const isInBasket =
    Array.isArray(basketItemIds) &&
    basketItemIds.some((item) => item?.listingId === listingId);

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
      await toggleBasket(e, isInBasket, "ACTIVE");
    } catch (error) {
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
