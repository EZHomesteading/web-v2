"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { orderMethod } from "@prisma/client";
import { DeliveryPickupToggleMode } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import useMediaQuery from "@/hooks/media-query";
import { RiArrowDropDownLine } from "react-icons/ri";
import SetCustomPickupDeliveryCalendar from "./calendar.listing";

const DateOverlay = ({
  errorType,
  listing,
  method,
  onOpenChange,
  selectedDateTime,
  formatOrderMethodText,
  time,
  date,
}: {
  time: string;
  errorType: any;
  listing: any;
  formatOrderMethodText: (method: orderMethod) => void;
  method: orderMethod;
  date: any;
  selectedDateTime: any;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const over_640px = useMediaQuery("(min-width: 750px )");
  const [isSelected, setIsSelected] = useState(true);
  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);
  const [time_type, set_time_type] = useState("ASAP");
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

  return (
    <>
      <div
        className={` pt-5 pl-1  pr-8 relative border-t border-custom hover:cursor-pointer rounded-bl-xl font-semibold ${
          errorType === "deliveryDate" || errorType === "pickupDate"
            ? "borderRed"
            : ""
        }
        ${method === orderMethod.PICKUP && "col-span-2 rounded-br-xl  "}`}
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
      >
        <div
          className={`absolute top-1 text-xs text-neutral-700 font-medium left-1`}
        >
          {`${
            selectedDateTime === date ? "Earliest " : ""
          }${formatOrderMethodText(method)} Date`}
        </div>
        <button className={`text-sm  `}>{time}</button>
        <div
          className={`absolute bottom-1/2 transform translate-y-1/2 right-2`}
        >
          <RiArrowDropDownLine />
        </div>
      </div>
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
                        >
                          <div>
                            {method === orderMethod.DELIVERY
                              ? "The earliest time seller can deliver to you"
                              : "The earliest time you can pick up from the seller"}
                          </div>
                          <div className="text-2xl underline">{time}</div>
                        </button>{" "}
                      </div>
                    ) : (
                      <SetCustomPickupDeliveryCalendar
                        mode={
                          method === orderMethod.DELIVERY
                            ? DeliveryPickupToggleMode.DELIVERY
                            : DeliveryPickupToggleMode.PICKUP
                        }
                        location={listing.location}
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
