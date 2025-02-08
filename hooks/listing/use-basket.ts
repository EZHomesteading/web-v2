// hooks/listing/use-cart.ts
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { Hours, orderMethod } from "@prisma/client";
import Toast from "@/components/ui/toast";

interface props {
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
}: props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isInBasket, setIsInBasket] = useState(false);
  let initialOrderMethod: orderMethod = orderMethod.PICKUP;

  if (!hours?.pickup && hours?.delivery) {
    initialOrderMethod = orderMethod.DELIVERY;
  }

  const checkExistingItem = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await axios.get(`/api/basket/check/${listingId}`);
      setIsInBasket(!!response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking basket:", error);
      return null;
    }
  }, [listingId, user]);

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
        setIsInBasket(true);
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
    [user, listingId, quantity, router]
  );

  const removeFromBasket = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const item = await checkExistingItem();
      if (!item?.id) {
        throw new Error("Item not found");
      }

      await axios.delete(`/api/basket/items/${item.id}`);
      setIsInBasket(false);
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
  }, [user, checkExistingItem, router]);

  const toggleBasket = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>,
      status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE"
    ) => {
      e.stopPropagation();

      if (isInBasket) {
        await removeFromBasket();
      } else {
        await addToBasket(status);
      }
    },
    [isInBasket, removeFromBasket, addToBasket]
  );

  return {
    isLoading,
    quantity,
    setQuantity,
    isInBasket,
    checkExistingItem,
    addToBasket,
    removeFromBasket,
    toggleBasket,
  };
};
