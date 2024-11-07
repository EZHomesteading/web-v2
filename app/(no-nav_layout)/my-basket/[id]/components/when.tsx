"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Basket_Selected_Time_Type } from "@/types/basket";
import { Availability, Hours, orderMethod } from "@prisma/client";
import { DeliveryPickupToggleMode } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import SetCustomPickupDeliveryCalendar from "./calendar.basket";
import { outfitFont } from "@/components/fonts";
import { week_day_mmm_dd_yy_time } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import useMediaQuery from "@/hooks/media-query";

const DateOverlay = ({
  errorType,
  basket,
  initialOrderMethod,
  saveChanges,
  onOpenChange,
}: {
  errorType: any;
  basket: Basket_Selected_Time_Type;
  initialOrderMethod: any;
  saveChanges: () => void;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const over_640px = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);
  const [time_type, set_time_type] = useState("ASAP");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [basketState, setBasketState] = useState<Basket_Selected_Time_Type>({
    ...basket,
    orderMethod: basket.orderMethod || initialOrderMethod,
    selected_time_type: null,
  });
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
        left: rect.left,
        width: 700,
        height: `calc(100vh - ${rect.bottom + 24}px)`, // 24px for additional padding
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
  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-center rounded-full border px-3 py-2 ${
          errorType === "deliveryDate" || errorType === "pickupDate"
            ? "borderRed"
            : ""
        }`}
      >
        {basket.orderMethod === orderMethod.DELIVERY
          ? basket.deliveryDate
            ? basket.deliveryDate.toString()
            : "When?"
          : basket.pickupDate
          ? basket.pickupDate.toString()
          : "When?"}
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
              className="bg-white rounded-3xl border shadow-xl z-[101] fixed w-full max-w-[700px] mx-auto inset-0 h-fit overflow-hidden"
            >
              <div className="relative h-full bg-white rounded-3xl flex flex-col p-4 pt-14">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-black bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex justify-center mb-4">
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
                        time_type === "CUSTOM" ? "bg-white" : ""
                      }`}
                      onClick={() => set_time_type("CUSTOM")}
                    >
                      Custom Time
                    </button>
                  </div>
                </div>

                {/* Conditional Render for ASAP vs Custom Time */}
                <div className="flex flex-col gap-y-4 items-center justify-center">
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
                      </button>
                    </div>
                  ) : (
                    <SetCustomPickupDeliveryCalendar
                      mode={
                        basket.orderMethod === orderMethod.DELIVERY
                          ? DeliveryPickupToggleMode.DELIVERY
                          : DeliveryPickupToggleMode.PICKUP
                      }
                      location={basket.location}
                    />
                  )}
                </div>

                {/* Save and Reset Buttons */}
                <div className="flex w-full justify-between mt-4 border-t pt-2">
                  <button
                    className={`underline text-neutral-500 ${
                      !basket.pickupDate &&
                      !basket.deliveryDate &&
                      "cursor-not-allowed"
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
                    className="text-white bg-black px-3 py-2 rounded-xl"
                    onClick={saveChanges}
                  >
                    Save Changes
                  </button>
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
