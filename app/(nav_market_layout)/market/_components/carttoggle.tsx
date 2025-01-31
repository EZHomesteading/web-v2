"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Trash } from "lucide-react";
import { toast } from "sonner";

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
  listingId,
  user,
  initialQuantity = 1,
  stock = 100,
  minOrder = 1,
  quantityType = "item",
  price,
  onCartUpdate,
}) => {
  // State management with type safety
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
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

  // Mock function to check existing item - replace with actual API call
  const checkExistingItem = async (): Promise<CartItem | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockItem = localStorage.getItem(`cart-${listingId}`);
        resolve(mockItem ? JSON.parse(mockItem) : null);
      }, 500);
    });
  };

  // Quantity handlers
  const increaseQuantity = (): void => {
    if (stock && quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Cannot exceed available stock");
    }
  };

  const decreaseQuantity = (): void => {
    if (quantity > minOrder) {
      setQuantity(quantity - 1);
    } else {
      toast.error(`Minimum order is ${minOrder} ${quantityType}`);
    }
  };

  // Cart operations with type safety
  const addToCart = async (): Promise<CartOperationResponse> => {
    const cartItem: CartItem = {
      listingId,
      quantity,
      price,
      quantityType,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(`cart-${listingId}`, JSON.stringify(cartItem));
    return {
      success: true,
      message: "Added to cart",
      item: cartItem,
    };
  };

  const removeFromCart = async (): Promise<CartOperationResponse> => {
    localStorage.removeItem(`cart-${listingId}`);
    return {
      success: true,
      message: "Removed from cart",
    };
  };

  // Cart toggle handler
  const handleToggleCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    setIsLoading(true);
    try {
      const result = isInCart ? await removeFromCart() : await addToCart();

      if (result.success) {
        setIsInCart(!isInCart);
        setExistingItem(result.item || null);
        toast.success(result.message);

        // Notify parent component of cart update if callback provided
        onCartUpdate?.(!isInCart, quantity);
      }
    } catch (error) {
      toast.error("Failed to update cart");
      console.error("Cart update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Type-safe event handler for quantity input
  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minOrder && value <= (stock || Infinity)) {
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
      {!isInCart && (
        <div className="flex flex-row justify-center items-center mt-2">
          Set Quantity
          <div className="flex items-center bg-gray-200 rounded-full ml-2 px-4 py-2">
            <button
              className="text-gray-600 focus:outline-none"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                decreaseQuantity();
              }}
              disabled={isLoading}
              type="button"
            >
              -
            </button>
            <input
              className="bg-transparent text-center w-12 appearance-none outline-none"
              value={quantity}
              type="number"
              min={minOrder}
              max={stock}
              onChange={handleQuantityChange}
              style={{
                WebkitAppearance: "textfield",
                MozAppearance: "textfield",
              }}
              disabled={isLoading}
            />
            <button
              className="text-gray-600 focus:outline-none"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                increaseQuantity();
              }}
              disabled={isLoading}
              type="button"
            >
              +
            </button>
          </div>
        </div>
      )}

      {existingItem && (
        <div className="p-2 bg-gray-50 rounded-md mb-2 w-full">
          <h3 className="font-medium text-sm mb-1">Currently in Cart:</h3>
          <ul className="text-sm text-gray-600">
            <li>
              Quantity: {existingItem.quantity} {quantityType}
            </li>
            <li>Added: {new Date(existingItem.timestamp).toLocaleString()}</li>
          </ul>
        </div>
      )}

      <Button
        onClick={handleToggleCart}
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
