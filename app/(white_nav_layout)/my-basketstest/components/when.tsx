"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Basket_Selected_Time_Type } from "@/types/basket";
import {
  Availability,
  basket_time_type,
  Hours,
  orderMethod,
} from "@prisma/client";
import { DeliveryPickupToggleMode } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import SetCustomPickupDeliveryCalendar from "./calendar.basket";
import {
  formatDateToMMMDDAtHourMin,
  week_day_mmm_dd_yy_time,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import useMediaQuery from "@/hooks/media-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DateOverlayProps {
  errorType: "undecided" | "location" | "deliveryDate" | "pickupDate" | null;
  basket: Basket_Selected_Time_Type;
  initialOrderMethod: orderMethod;
  onOpenChange: (open: boolean) => void;
}

export const DateOverlay: React.FC<DateOverlayProps> = ({
  errorType,
  basket,
  initialOrderMethod,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [basketState, setBasketState] = useState<Basket_Selected_Time_Type>({
    ...basket,
    orderMethod: basket.orderMethod || initialOrderMethod,
    selected_time_type: null,
  });

  const over_640px = useMediaQuery("(min-width: 750px )");

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);
  const [time_type, set_time_type] = useState(basket.time_type);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const getInitialPosition = () => {
    if (!triggerRef.current) return { top: 0, left: 0, width: 0, height: 0 };
    const rect = triggerRef.current.getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  };

  const getAnimatePosition = () => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();

    if (over_640px) {
      return {
        top: rect.bottom + 8,
        left: -20,
        width: 700,
        height: 475,
        opacity: 1,
      };
    }

    return {
      top: "4px",
      left: "4px",
      right: "4px",
      bottom: "4px",
      width: "calc(100% - 8px)",
      height: "calc(100% - 8px)",
      opacity: 1,
    };
  };

  const findEarliestTime = (orderType: orderMethod, sellerHours: Hours) => {
    const currentDate = new Date();
    const relevantHours =
      orderType === orderMethod.DELIVERY
        ? sellerHours.delivery
        : sellerHours.pickup;

    const firstAvailable = relevantHours
      .filter((availability: Availability) => {
        const availableDate = new Date(availability.date);
        return !isNaN(availableDate.getTime()) && availableDate >= currentDate;
      })
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

    if (!firstAvailable) {
      return { time: "No available time", date: null };
    }

    const { time, date } = week_day_mmm_dd_yy_time(
      firstAvailable.timeSlots[0].open,
      new Date(firstAvailable.date)
    );

    return { time, date };
  };

  const { time, date } = findEarliestTime(
    basket.orderMethod,
    basket.location?.hours
  );
  const earlyDate = new Date(date || new Date());
  const dDate = basketState.deliveryDate
    ? new Date(basketState.deliveryDate)
    : null;
  const pDate = basket.deliveryDate ? new Date(basket.deliveryDate) : null;

  const isSelectedDate = (date1: Date | null, date2: Date) => {
    return date1?.getTime() === date2.getTime();
  };

  const [isSelected, setIsSelected] = useState(
    pDate ? isSelectedDate(pDate, earlyDate) : isSelectedDate(dDate, earlyDate)
  );

  const handleAsapClick = () => {
    setBasketState((prev) => {
      const newState = { ...prev };

      if (isSelected) {
        newState.deliveryDate = null;
        newState.pickupDate = null;
        newState.selected_time_type = null;
        setIsSelected(false);
      } else {
        if (basket.orderMethod === orderMethod.PICKUP) {
          newState.deliveryDate = null;
          newState.proposedLoc = null;
          newState.pickupDate = date || null;
        } else {
          newState.pickupDate = null;
          newState.deliveryDate = date || null;
        }
        newState.selected_time_type = "ASAP";
        setIsSelected(true);
      }

      return newState;
    });
  };
  const router = useRouter();
  const saveChanges = async () => {
    try {
      const res = await axios.post("/api/baskets/update", {
        id: basketState.id,
        deliveryDate: basketState.deliveryDate,
        pickupDate: basketState.pickupDate,
        orderMethod: basketState.orderMethod,
        proposedLoc: basketState.proposedLoc,
        items: basketState.items,
        time_type: "ASAP",
      });

      if (res.status === 200) {
        toast.success("Basket was updated");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update basket");
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={`flex items-center text-xs sm:text-sm justify-center rounded-full border px-3 py-2 ${
          errorType === "deliveryDate" || errorType === "pickupDate"
            ? "borderRed"
            : ""
        }`}
      >
        {(basket.deliveryDate &&
          formatDateToMMMDDAtHourMin(new Date(basket.deliveryDate))) ||
          (basket.pickupDate &&
            formatDateToMMMDDAtHourMin(new Date(basket.pickupDate))) ||
          "When?"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed ${
                over_640px
                  ? "sm:bg-transparent"
                  : "bg-white/80 backdrop-blur-md"
              } inset-0 z-[100]`}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={getInitialPosition()}
              animate={getAnimatePosition()}
              exit={getInitialPosition()}
              transition={{
                duration: 0.3,
                ease: [0.32, 0.72, 0, 1],
                width: { duration: 0.2 },
              }}
              className="bg-white rounded-3xl border shadow-xl z-[101] fixed w-full max-w-[700px] mx-auto inset-0 h-[550px] overflow-y-auto"
            >
              <div className="relative h-full bg-white rounded-3xl flex flex-col  px-2 pb-1 pt-14">
                <div className={`flex flex-col justify-start `}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-black bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex justify-center mb-2">
                    <div className="bg-slate-300 rounded-full p-1 flex space-x-2 text-xs font-semibold">
                      <button
                        className={`py-2 px-4 rounded-full ${
                          time_type === "ASAP" ? "bg-white" : ""
                        }`}
                        onClick={() => set_time_type("ASAP")}
                      >
                        As Soon as Possible
                      </button>
                      <button
                        className={`py-2 px-4 rounded-full ${
                          time_type === "ASAP" ? "" : "bg-white"
                        }`}
                        onClick={() => set_time_type("CUSTOM")}
                      >
                        Custom Time
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-4 items-center justify-start h-fit ">
                    {time_type === "ASAP" ? (
                      <div className="flex flex-col items-center justify-center w-full">
                        <button
                          className={`p-6 border shadow-md w-[400px] max-w-full rounded-xl flex flex-col items-center justify-center ${
                            isSelected ? "bg-emerald-700/20" : "bg-white"
                          }`}
                          onClick={handleAsapClick}
                        >
                          <div>
                            {basket.orderMethod === orderMethod.DELIVERY
                              ? "The earliest time seller can deliver to you"
                              : "The earliest time you can pick up from the seller"}
                          </div>
                          <div className="text-2xl underline">{time}</div>
                        </button>{" "}
                        <div className={`absolute bottom-2   w-full`}>
                          <div className="flex w-full px-2 justify-between border-t pt-2 mt-4">
                            <button
                              className={`underline text-black ${
                                !basketState.pickupDate &&
                                !basketState.deliveryDate &&
                                "cursor-not-allowed pointer-events-none text-neutral-500"
                              }`}
                              onClick={() =>
                                setBasketState((prev) => ({
                                  ...prev,
                                  deliveryDate: null,
                                  pickupDate: null,
                                }))
                              }
                            >
                              Reset
                            </button>
                            <button
                              className={`text-white  px-3 py-2 rounded-3xl bg-black`}
                              onClick={saveChanges}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <SetCustomPickupDeliveryCalendar
                        mode={
                          basket.orderMethod === orderMethod.DELIVERY
                            ? DeliveryPickupToggleMode.DELIVERY
                            : DeliveryPickupToggleMode.PICKUP
                        }
                        basket={basket}
                        location={basket.location}
                        onClose={() => setIsOpen(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DateOverlay;
