// hooks/listing/use-cart.ts
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Hours, orderMethod } from "@prisma/client";
import { hasAvailableHours } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";

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
  const { initialOrderMethod } = useMemo(() => {
    const hasPickup = hasAvailableHours(hours?.pickup || []);
    const hasDelivery = hasAvailableHours(hours?.delivery || []);

    let initialOrderMethod: orderMethod;
    if (hasPickup && hasDelivery) {
      initialOrderMethod = orderMethod.UNDECIDED;
    } else if (hasPickup) {
      initialOrderMethod = orderMethod.PICKUP;
    } else if (hasDelivery) {
      initialOrderMethod = orderMethod.DELIVERY;
    } else {
      initialOrderMethod = orderMethod.UNDECIDED;
    }

    return { initialOrderMethod };
  }, [hours]);
  console.log(hours, initialOrderMethod);
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
        toast.success("Added to baskets!");
        router.refresh();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
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
      // First get the basket item ID
      const item = await checkExistingItem();
      if (!item?.id) {
        throw new Error("Item not found");
      }

      // Then delete using the item ID
      await axios.delete(`/api/basket/items/${item.id}`);
      setIsInBasket(false);
      toast.success("Removed from cart");
      router.refresh();
    } catch (error: any) {
      console.error("Remove error:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
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
