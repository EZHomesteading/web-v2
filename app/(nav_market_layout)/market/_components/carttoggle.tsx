"use client";

import { useState, useEffect } from "react";
import { useBasket } from "@/hooks/listing/use-basket";
import Toast from "@/components/ui/toast";
import Link from "next/link";
import { PiBasketThin } from "react-icons/pi";

export interface CartItem {
  listingId: string;
  quantity: number;
  price: number;
  quantityType: string;
  timestamp: string;
}

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
  quantityType?: string;
  price: number;
  onCartUpdate?: (inCart: boolean, quantity: number) => void;
}

const CartToggle = ({
  listingId,
  user,
  stock,
  basketItemIds,
  minOrder,
  quantityType,
}: CartToggleProps) => {
  const {
    isLoading,
    quantity,
    setQuantity,
    toggleBasket,
    checkExistingItem,
    isInBasket,
  } = useBasket({
    listingId,
    user,
    initialQuantity: minOrder || 1,
  });

  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [existingItem, setExistingItem] = useState<CartItem | null>(null);

  useEffect(() => {
    const checkCart = async (): Promise<void> => {
      if (user) {
        try {
          const item = await checkExistingItem();
          setExistingItem(item);
          if (item?.quantity) {
            setQuantity(item.quantity);
            setIsInCart(true);
          }
        } catch (error) {
          console.error("Error checking cart:", error);
        }
      }
    };
    checkCart();
  }, [user]);

  // const increaseQuantity = (): void => {
  //   if (stock && quantity < stock) {
  //     setQuantity(quantity + 1);
  //   } else {
  //     Toast({ message: "Cannot exceed available stock" });
  //   }
  // };

  // const decreaseQuantity = (): void => {
  //   if (quantity > (minOrder ? minOrder : 1)) {
  //     setQuantity(quantity - 1);
  //   } else {
  //     toast.error(`Minimum order is ${minOrder} ${quantityType}`);
  //   }
  // };

  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      Toast({
        message: "Please sign in to add items to your basket",
        details: (
          <Link
            href="/auth/login"
            className={`text-sky-400 underline font-light`}
          >
            Sign in here
          </Link>
        ),
      });
      return;
    }

    try {
      await toggleBasket(e);
      if (!isInBasket) {
        const item = await checkExistingItem();
        setExistingItem(item);
      } else {
        setExistingItem(null);
      }
    } catch (error) {
      Toast({ message: "Failed to update basket" });
    }
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value);
    if (
      !isNaN(value) &&
      value >= (minOrder ? minOrder : 1) &&
      value <= (stock || Infinity)
    ) {
      setQuantity(value);
    }
  };

  // const renderCartButtonText = (): JSX.Element => {
  //   if (isLoading) {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Loader2 className="h-4 w-4 animate-spin" />
  //         Processing...
  //       </div>
  //     );
  //   }

  //   if (isInCart) {
  //     return (
  //       <div className="flex items-center justify-center gap-2">
  //         <Trash className="h-4 w-4" />
  //         Remove from Cart
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="flex items-center justify-center gap-2">
  //       <ShoppingCart className="h-4 w-4" />
  //       Add {quantity} {quantityType} to Cart
  //     </div>
  //   );
  // };
  return (
    <div className={`absolute top-3 right-3`}>
      <button
        disabled={isLoading}
        onClick={handleToggleBasket}
        className={`w-8 rounded-full  aspect-square h-8 border flex items-center justify-center shadow-xl ${
          isInCart ? "bg-red-400 hover:bg-red-500" : "bg-black/30 "
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
export default CartToggle;
