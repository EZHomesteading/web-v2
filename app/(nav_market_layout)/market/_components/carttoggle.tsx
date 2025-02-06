"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Trash } from "lucide-react";
import { toast } from "sonner";
import { useBasket } from "@/hooks/listing/use-basket";
// Type for the cart item
interface CartItem {
  listingId: string;
  quantity: number;
  price: number;
  quantityType: string;
  timestamp: string;
}

// Type for user - matching structure from provided code
interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
}

// Props interface for the component
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

// Type for cart operation response
interface CartOperationResponse {
  success: boolean;
  message?: string;
  item?: CartItem;
}

const CartToggle: React.FC<CartToggleProps> = ({
  listing,
  listingId,
  user,
  initialQuantity = 1,
  stock,
  minOrder,
  quantityType,
  price,
  onCartUpdate,
}) => {
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
  // State management with type safety

  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [existingItem, setExistingItem] = useState<CartItem | null>(null);

  // Check if item exists in cart on mount
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

  // Quantity handlers
  const increaseQuantity = (): void => {
    if (stock && quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Cannot exceed available stock");
    }
  };

  const decreaseQuantity = (): void => {
    if (quantity > (minOrder ? minOrder : 1)) {
      setQuantity(quantity - 1);
    } else {
      toast.error(`Minimum order is ${minOrder} ${quantityType}`);
    }
  };

  // Cart toggle handler
  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      toast.error("Please login to add items to your Wish List");
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
      toast.error("Failed to update basket");
    }
  };

  // Type-safe event handler for quantity input
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

  // Render cart button text
  const renderCartButtonText = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      );
    }

    if (isInCart) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Trash className="h-4 w-4" />
          Remove from Cart
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Add {quantity} {quantityType} to Cart
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleToggleBasket}
        disabled={isLoading}
        className={`w-full shadow-xl mb-2 ${
          isInCart
            ? "bg-red-400 hover:bg-red-500"
            : "bg-green-400 hover:bg-green-500"
        }`}
      >
        {renderCartButtonText()}
      </Button>
    </div>
  );
};

export default CartToggle;
