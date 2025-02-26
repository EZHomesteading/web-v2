import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { orderMethod } from "@prisma/client";
import Toast from "@/components/ui/toast";

interface TimeSlot {
  open: number;
  close: number;
}

interface DayHours {
  date: string;
  timeSlots: TimeSlot[];
  capacity: number;
}

interface LocationHours {
  pickup: DayHours[];
  delivery: DayHours[];
}

interface BasketProps {
  listingId: string;
  address: any;
  user?: any | null;
  initialQuantity?: number;
  hours?: LocationHours | null;
  onBasketUpdate: (newState: boolean) => void;
}

const getHoursForMethod = (
  hours: LocationHours | null | undefined,
  method: orderMethod
): DayHours[] | undefined => {
  if (!hours) return undefined;
  return method === orderMethod.PICKUP ? hours.pickup : hours.delivery;
};

export const useBasket = ({
  listingId,
  address,
  user,
  initialQuantity = 1,
  hours,
  onBasketUpdate,
}: BasketProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showWarning, setShowWarning] = useState(false);
  const [incompatibleDays, setIncompatibleDays] = useState<
    Array<{
      date: string;
      compatible: boolean;
      overlapHours: number;
      overlapTimeRange?: string;
    }>
  >([]);
  const [shopHoursForNextWeek, setShopHoursForNextWeek] = useState<Array<any>>(
    []
  );
  const [isFirstItemInCart, setIsFirstItemInCart] = useState(false);
  const [isSameSellerAsCart, setIsSameSellerAsCart] = useState(false);

  let initialOrderMethod: orderMethod = orderMethod.PICKUP;
  if (!hours?.pickup?.length && hours?.delivery?.length) {
    initialOrderMethod = orderMethod.DELIVERY;
  }

  // Format time (minutes since midnight) to a user-friendly string
  const formatTimeString = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Convert to 12-hour format with am/pm
    const period = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;

    // Only include minutes if non-zero
    return minutes === 0
      ? `${displayHours}${period}`
      : `${displayHours}:${minutes.toString().padStart(2, "0")}${period}`;
  };

  // Fetch active baskets and return the basket data, not just hours
  const fetchActiveBaskets = useCallback(async () => {
    if (!user?.id) return { basketHours: [], basketData: [] };

    try {
      console.log("Fetching active baskets for user:", user.id);
      const response = await axios.get(`/api/baskets/active?userId=${user.id}`);
      console.log("Active baskets:", response.data);

      const basketHours = response.data
        .map((basket: any) => basket.location?.hours)
        .filter((hours: LocationHours | null) => hours !== null);

      return {
        basketHours,
        basketData: response.data,
      };
    } catch (error) {
      console.error("Error fetching active baskets:", error);
      return { basketHours: [], basketData: [] };
    }
  }, [user?.id]);

  // Check if the current item is from the same seller as items in cart
  const checkIfSameSeller = useCallback(
    async (address: any) => {
      if (!user?.id) return false;

      try {
        // Get the current listing details to find the seller

        // Get items already in cart
        const { basketData } = await fetchActiveBaskets();

        // Check if any item in the cart is from the same seller
        const hasSameSeller = basketData.some((basketItem: any) => {
          const itemSellerAdd = basketItem.location.address;
          const isSame =
            JSON.stringify(itemSellerAdd) === JSON.stringify(address);
          console.log(
            `Comparing basket item seller ${itemSellerAdd} with current ${address}: ${isSame}`
          );
          return isSame;
        });

        console.log("Has same seller in cart:", hasSameSeller);
        return hasSameSeller;
      } catch (error) {
        console.error("Error checking if same seller:", error);
        return false;
      }
    },
    [user?.id, fetchActiveBaskets]
  );

  // Don't use useCallback for this function as it creates dependency issues
  const prepareShopHoursDisplay = () => {
    if (!hours) return [];

    const currentHours = getHoursForMethod(hours, initialOrderMethod);
    if (!currentHours?.length) return [];

    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    return next7Days.map((date) => {
      const dayHours = currentHours.find(
        (h) => new Date(h.date).toISOString().split("T")[0] === date
      );

      // Format timeSlots for display
      const formattedTimeSlots =
        dayHours?.timeSlots.map((slot) => ({
          openFormatted: formatTimeString(slot.open),
          closeFormatted: formatTimeString(slot.close),
          ...slot,
        })) || [];

      return {
        date,
        timeSlots: formattedTimeSlots,
        capacity: dayHours?.capacity || 0,
        dayName: new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        monthDay: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  };

  const checkHoursCompatibility = useCallback(async () => {
    // Fetch fresh basket hours when checking compatibility
    const { basketHours: existingHours } = await fetchActiveBaskets();

    // Always prepare shop hours for next week
    const shopHours = prepareShopHoursDisplay();
    setShopHoursForNextWeek(shopHours);

    if (!existingHours.length) {
      // Return the shopHours with all days marked as compatible
      return shopHours.map((day) => ({
        ...day,
        compatible: true,
        overlapHours: day.timeSlots.reduce(
          (total, slot) => total + (slot.close - slot.open) / 60,
          0
        ),
        overlapTimeRange: day.timeSlots
          .map((slot) => `${slot.openFormatted}-${slot.closeFormatted}`)
          .join(", "),
      }));
    }

    // If there are no hours for the current listing, return all days as incompatible
    const currentHours = getHoursForMethod(hours, initialOrderMethod);
    if (!currentHours?.length) {
      return shopHours.map((day) => ({
        ...day,
        compatible: false,
        overlapHours: 0,
      }));
    }

    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    const dateCompatibility: {
      date: string;
      compatible: boolean;
      overlapHours: number;
      overlapTimeRange?: string;
      dayName?: string;
      monthDay?: string;
      timeSlots?: any[];
    }[] = [];

    next7Days.forEach((date) => {
      const currentDayHours = currentHours.find(
        (h) => new Date(h.date).toISOString().split("T")[0] === date
      );

      const matchingShopHours = shopHours.find((day) => day.date === date);

      let minOverlapHours = Infinity;
      let bestOverlapRange: { start: number; end: number } | null = null;

      const hasIncompatibleHours = existingHours.some((basketHours: any) => {
        const basketMethodHours = getHoursForMethod(
          basketHours,
          initialOrderMethod
        );
        const basketDayHours = basketMethodHours?.find(
          (h) => new Date(h.date).toISOString().split("T")[0] === date
        );

        // Calculate overlap duration
        let maxOverlap = 0;
        let bestRange: { start: number; end: number } | null = null;

        if (currentDayHours?.timeSlots && basketDayHours?.timeSlots) {
          for (const slot1 of currentDayHours.timeSlots) {
            for (const slot2 of basketDayHours.timeSlots) {
              const overlapStart = Math.max(slot1.open, slot2.open);
              const overlapEnd = Math.min(slot1.close, slot2.close);
              if (overlapEnd > overlapStart) {
                const overlapDuration = (overlapEnd - overlapStart) / 60; // Convert to hours
                if (overlapDuration > maxOverlap) {
                  maxOverlap = overlapDuration;
                  bestRange = { start: overlapStart, end: overlapEnd };
                }
              }
            }
          }
        }

        if (maxOverlap < minOverlapHours) {
          minOverlapHours = maxOverlap;
          bestOverlapRange = bestRange;
        }

        return maxOverlap < 2; // Less than 2 hours overlap is considered incompatible
      });

      // Create time range string if we have valid overlap
      let overlapTimeRange: string | undefined = undefined;
      if (bestOverlapRange && minOverlapHours > 0) {
        const { start, end } = bestOverlapRange as {
          start: number;
          end: number;
        };
        overlapTimeRange = `${formatTimeString(start)}-${formatTimeString(
          end
        )}`;
      }

      dateCompatibility.push({
        ...matchingShopHours,
        date,
        compatible: !hasIncompatibleHours,
        overlapHours: minOverlapHours === Infinity ? 0 : minOverlapHours,
        overlapTimeRange,
      });
    });

    return dateCompatibility;
  }, [hours, initialOrderMethod, fetchActiveBaskets]);

  useEffect(() => {
    // Initialize shop hours on component mount - only once
    const initializeHours = async () => {
      // Just prepare display hours without checking compatibility
      const shopHours = prepareShopHoursDisplay();
      setShopHoursForNextWeek(shopHours);
    };

    initializeHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToBasket = useCallback(
    async (
      status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE",
      newQuantity?: number
    ) => {
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
          quantity: newQuantity || quantity,
          status,
          initialOrderMethod: initialOrderMethod,
        });
        Toast({
          message: `Added to basket`,
        });
        onBasketUpdate(true);
      } catch (error: any) {
        Toast({
          message: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, listingId, quantity, router, initialOrderMethod, onBasketUpdate]
  );

  const removeFromBasket = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await axios.delete(`/api/basket/items/${listingId}`);
      Toast({ message: "Basket item removed" });
      onBasketUpdate(false);
    } catch (error: any) {
      console.error("Remove error:", error);
      Toast({
        message: error.response?.data?.message || "Failed to remove item",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, listingId, onBasketUpdate]);

  const updateQuantity = async (newQuantity: number) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await axios.post(`/api/basket/items`, {
        listingId: listingId,
        quantity: newQuantity,
      });
      setQuantity(newQuantity);
    } catch (error: any) {
      Toast({
        message: error.response?.data?.message || "Failed to update quantity",
      });
      setQuantity(quantity);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if this would be the first item during hours check
  const checkIsFirstItem = useCallback(async () => {
    if (!user?.id) return true; // If no user, consider it first item

    try {
      console.log("Checking if first item for user:", user.id);
      const { basketData } = await fetchActiveBaskets();
      const result = basketData.length === 0;
      console.log(
        "First item check result:",
        result,
        "Basket count:",
        basketData.length
      );
      return result;
    } catch (error) {
      console.error("Error checking if first item:", error);
      return false;
    }
  }, [user?.id, fetchActiveBaskets]);

  // Modified toggle function to check if first item or same seller
  const toggleBasketWithFirstItemCheck = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>,
      isInBasket: boolean,
      status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE",
      newQuantity?: number
    ) => {
      e.stopPropagation();
      if (isInBasket) {
        await removeFromBasket();
        onBasketUpdate(false);
      } else {
        if (newQuantity && newQuantity !== quantity) {
          setQuantity(newQuantity);
        }

        // IMPORTANT: Check if first item or from same seller
        const isFirstItem = await checkIsFirstItem();
        const isSameSeller = await checkIfSameSeller(address);

        // Update states immediately
        setIsFirstItemInCart(isFirstItem);
        setIsSameSellerAsCart(isSameSeller);
        console.log("First item:", isFirstItem, "Same seller:", isSameSeller);

        // If it's from the same seller, add directly without showing warning
        if (isSameSeller && !isFirstItem) {
          console.log("Adding item from same seller without warning");
          await addToBasket(status);
          onBasketUpdate(true);
          return;
        }

        // Always check hours compatibility for other cases
        const compatibilityData = await checkHoursCompatibility();
        setIncompatibleDays(compatibilityData);

        // Show modal for first item or compatibility check
        setShowWarning(true);
      }
    },
    [
      removeFromBasket,
      checkIsFirstItem,
      checkIfSameSeller,
      listingId,
      checkHoursCompatibility,
      quantity,
      setQuantity,
      onBasketUpdate,
      addToBasket,
    ]
  );

  return {
    isLoading,
    quantity,
    setQuantity,
    addToBasket,
    removeFromBasket,
    toggleBasket: toggleBasketWithFirstItemCheck,
    showWarning,
    setShowWarning,
    incompatibleDays,
    updateQuantity,
    shopHoursForNextWeek,
    isFirstItemInCart,
    isSameSellerAsCart,
  };
};
