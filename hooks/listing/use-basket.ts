// hooks/listing/use-cart.ts
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { Hours, orderMethod } from "@prisma/client";
import Toast from "@/components/ui/toast";

// Define clear interfaces for our types
interface BasketProps {
  listingId: string;
  user?: any | null;
  initialQuantity?: number;
  hours?: Hours | null;
}

export const useBasket = ({
  listingId,
  user,
  initialQuantity = 1,
  hours,
}: BasketProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);

  let initialOrderMethod: orderMethod = orderMethod.PICKUP;
  if (!hours?.pickup && hours?.delivery) {
    initialOrderMethod = orderMethod.DELIVERY;
  }

  const addToBasket = useCallback(
    async (status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE") => {
      if (!user) {
        router.push(
          `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
        return;
      }

      setIsLoading(true);
      try {
        await axios.post(`/api/basket/items`, {
          listingId,
          quantity,
          status,
          initialOrderMethod: initialOrderMethod,
        });
        Toast({ message: "Saved new basket item" });
        router.refresh();
      } catch (error: any) {
        Toast({
          message: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, listingId, quantity, router, initialOrderMethod]
  );

  const removeFromBasket = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await axios.delete(`/api/basket/items/${listingId}`);
      Toast({ message: "Basket item removed" });
      router.refresh();
    } catch (error: any) {
      console.error("Remove error:", error);
      Toast({
        message: error.response?.data?.message || "Failed to remove item",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, listingId, router]);

  const toggleBasket = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>,
      isInBasket: boolean,
      status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE"
    ) => {
      e.stopPropagation();
      if (isInBasket) {
        await removeFromBasket();
      } else {
        await addToBasket(status);
      }
    },
    [removeFromBasket, addToBasket]
  );

  return {
    isLoading,
    quantity,
    setQuantity,
    addToBasket,
    removeFromBasket,
    toggleBasket,
  };
};
