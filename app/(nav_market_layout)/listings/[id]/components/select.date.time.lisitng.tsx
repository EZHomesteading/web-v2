"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { orderMethod } from "@prisma/client";
import { DeliveryPickupToggleMode } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { RiArrowDropDownLine } from "react-icons/ri";
import SetCustomPickupDeliveryCalendar from "./calendar.listing";
import { outfitFont } from "@/components/fonts";

const DateOverlay = ({
  errorType,
  setSelectedDateTime,
  listing,
  method,
  selectedDateTime,
  formatOrderMethodText,
  time,
  date,
}: {
  time: string;
  setSelectedDateTime: any;
  errorType: any;
  listing: any;
  formatOrderMethodText: (method: orderMethod) => void;
  method: orderMethod;
  date: any;
  selectedDateTime: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState<{
    [key: string]: boolean;
  }>({
    ASAP: false,
    Tomorrow: false,
    "This Weekend": false,
  });
  const toggleSelection = (label: string) => {
    setIsSelected((prev) => ({
      ASAP: false,
      Tomorrow: false,
      "This Weekend": false,
      [label]: !prev[label],
    }));
  };

  const [time_type, set_time_type] = useState("ASAP");

  return (
    <>
      <div
        className={` pt-5 pl-1  pr-8 relative border-t border-custom hover:cursor-pointer rounded-bl-xl font-semibold ${
          errorType === "deliveryDate" || errorType === "pickupDate"
            ? "borderRed"
            : ""
        }
        ${method === orderMethod.PICKUP && "col-span-2 rounded-br-xl  "}`}
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
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm zmax"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-2 m-auto  bg-white rounded-lg px-4 h-calc(100vw-.5rem) md:max-h-[28rem] max-w-2xl zmax w-calc(100vw-.5rem) border p-0 ${outfitFont.className}`}
            >
              <div className="relative h-full bg-white rounded-3xl flex flex-col  pt-14">
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
                        Common Presets
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
                      <div className="flex flex-col items-start md:items-center justify-center w-full">
                        {["ASAP", "Tomorrow", "This Weekend"].map((label) => (
                          <PresetButton
                            key={label}
                            label={label}
                            time={time}
                            isSelected={isSelected[label]}
                            toggleSelection={toggleSelection}
                          />
                        ))}
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
                        selectedDateTime={selectedDateTime}
                        setSelectedDateTime={setSelectedDateTime}
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
const PresetButton = ({
  isSelected,
  time,
  label,
  toggleSelection,
}: {
  isSelected: boolean;
  time: string;
  label: string;
  toggleSelection: (label: string) => void;
}) => {
  return (
    <div className={`relative max-w-sm w-full `}>
      {" "}
      <div className={`font-medium text-lg sticky underline text-start`}>
        {label}
      </div>
      <button onClick={() => toggleSelection(label)} className={``}>
        <div className="text-md font-medium">{time}</div>
      </button>
    </div>
  );
};
export default DateOverlay;
