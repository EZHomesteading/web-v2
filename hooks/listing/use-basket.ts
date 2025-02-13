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
  user?: any | null;
  initialQuantity?: number;
  hours?: LocationHours | null;
  basketItemIds?: Array<{ listingId: string; id: string }> | null;
}

const hasOverlappingHours = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  return slot1.open < slot2.close && slot2.open < slot1.close;
};

const findCompatibleSlots = (
  dayHours1: DayHours | undefined,
  dayHours2: DayHours | undefined
): boolean => {
  if (!dayHours1?.timeSlots?.length || !dayHours2?.timeSlots?.length) {
    return false;
  }

  for (const slot1 of dayHours1.timeSlots) {
    for (const slot2 of dayHours2.timeSlots) {
      if (hasOverlappingHours(slot1, slot2)) {
        return true;
      }
    }
  }
  return false;
};

const getHoursForMethod = (
  hours: LocationHours | null | undefined,
  method: orderMethod
): DayHours[] | undefined => {
  if (!hours) return undefined;
  return method === orderMethod.PICKUP ? hours.pickup : hours.delivery;
};

export const useBasket = ({
  listingId,
  user,
  initialQuantity = 1,
  hours,
  basketItemIds = null,
}: BasketProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showWarning, setShowWarning] = useState(false);
  const [incompatibleDays, setIncompatibleDays] = useState<
    Array<{ date: string; compatible: boolean; overlapHours: number }>
  >([]);
  const [existingBasketHours, setExistingBasketHours] = useState<
    LocationHours[]
  >([]);

  let initialOrderMethod: orderMethod = orderMethod.PICKUP;
  if (!hours?.pickup?.length && hours?.delivery?.length) {
    initialOrderMethod = orderMethod.DELIVERY;
  }

  const fetchActiveBaskets = useCallback(async () => {
    if (!user?.id) return [];

    try {
      //console.log("Fetching active baskets for user:", user.id);
      const response = await axios.get(`/api/baskets/active?userId=${user.id}`);
      // console.log("Active baskets response:", response.data);

      // Extract hours from all baskets
      const basketHours = response.data
        .map((basket: any) => basket.location?.hours)
        .filter((hours: LocationHours | null) => hours !== null);

      //console.log("Extracted basket hours:", basketHours);
      return basketHours;
    } catch (error) {
      console.error("Error fetching active baskets:", error);
      return [];
    }
  }, [user?.id]);

  const checkHoursCompatibility = useCallback(async () => {
    // console.log("Checking hours compatibility");
    //console.log("Current hours:", hours);
    //console.log("Initial order method:", initialOrderMethod);

    // Fetch fresh basket hours when checking compatibility
    const existingHours = await fetchActiveBaskets();
    //console.log("Fetched basket hours:", existingHours);

    if (!existingHours.length) {
      //console.log("No existing basket hours, skipping check");
      return [];
    }

    // If there are no hours for the current listing, return all days as incompatible
    const currentHours = getHoursForMethod(hours, initialOrderMethod);
    if (!currentHours?.length) {
      //console.log("No hours found for current listing");
      return [];
    }

    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    //console.log("Checking next 7 days:", next7Days);

    const dateCompatibility: {
      date: string;
      compatible: boolean;
      overlapHours: number;
    }[] = [];

    next7Days.forEach((date) => {
      const currentDayHours = currentHours.find(
        (h) => new Date(h.date).toISOString().split("T")[0] === date
      );

      // console.log(`Checking date ${date}:`, {
      //   currentDayHours,
      // });

      let minOverlapHours = Infinity;

      const hasIncompatibleHours = existingHours.some((basketHours: any) => {
        const basketMethodHours = getHoursForMethod(
          basketHours,
          initialOrderMethod
        );
        const basketDayHours = basketMethodHours?.find(
          (h) => new Date(h.date).toISOString().split("T")[0] === date
        );

        // console.log(`Basket hours for date ${date}:`, {
        //  basketDayHours,
        //});

        // Calculate overlap duration
        let maxOverlap = 0;
        if (currentDayHours?.timeSlots && basketDayHours?.timeSlots) {
          for (const slot1 of currentDayHours.timeSlots) {
            for (const slot2 of basketDayHours.timeSlots) {
              const overlapStart = Math.max(slot1.open, slot2.open);
              const overlapEnd = Math.min(slot1.close, slot2.close);
              if (overlapEnd > overlapStart) {
                const overlapDuration = (overlapEnd - overlapStart) / 60; // Convert to hours
                maxOverlap = Math.max(maxOverlap, overlapDuration);
              }
            }
          }
        }

        minOverlapHours = Math.min(minOverlapHours, maxOverlap);
        return maxOverlap < 2; // Less than 2 hours overlap is considered incompatible
      });

      dateCompatibility.push({
        date,
        compatible: !hasIncompatibleHours,
        overlapHours: minOverlapHours === Infinity ? 0 : minOverlapHours,
      });
    });

    //console.log("Date compatibility:", dateCompatibility);
    return dateCompatibility;
  }, [hours, initialOrderMethod, fetchActiveBaskets]);

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
        //console.log("Toggle basket called - checking hours compatibility");
        const incompatibleDates = await checkHoursCompatibility();
        //console.log("Incompatible dates found:", incompatibleDates);

        const incompatibleResults = incompatibleDates.filter(
          (date) => !date.compatible
        );
        if (incompatibleResults.length > 0) {
          //console.log("Setting warning state");
          setIncompatibleDays(incompatibleDates);
          setShowWarning(true);
        } else {
          // console.log("No incompatible dates - adding to basket");
          await addToBasket(status);
        }
      }
    },
    [removeFromBasket, addToBasket, checkHoursCompatibility]
  );

  return {
    isLoading,
    quantity,
    setQuantity,
    addToBasket,
    removeFromBasket,
    toggleBasket,
    showWarning,
    setShowWarning,
    incompatibleDays,
  };
};
