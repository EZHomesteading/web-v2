"use client";
//parent element for date picker and handling of datepicker related data to be sent to the cart parent element.
import { SheetCartC, SheetContentC } from "@/components/ui/sheet-cart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";
import "react-datetime-picker/dist/DateTimePicker.css";
import CustomTimeModal from "./customTimeModal";
import { Outfit } from "next/font/google";
import { CartGroup2, ValidTime } from "../client";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface StatusProps {
  role: string;
  hours: ExtendedHours;
  onSetTime: (childTime: ValidTime) => void;
  index: number;
  cartGroup: CartGroup | null;
  sodtarr: CartGroup2[];
}

const DateState = ({
  hours,
  cartGroup,
  onSetTime,
  index,
  role,
  sodtarr,
}: StatusProps) => {
  const [selectedTime, setSelectedTime] = useState<ValidTime>(); //users selected time
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formatPickupTime = (selectedTime: ValidTime) => {
    // formats pickup time from date type to date string readable by our other formatters.
    if (!selectedTime) return "";

    const { pickupTime } = selectedTime;
    const now = new Date();
    const pickupDate = new Date(pickupTime);

    if (pickupDate.toDateString() === now.toDateString()) {
      return `Today at ${pickupDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (pickupDate.getTime() < now.getTime() + 7 * 24 * 60 * 60 * 1000) {
      return `${pickupDate.toLocaleDateString([], {
        weekday: "long",
      })} at ${pickupDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else {
      return `${pickupDate.toLocaleDateString()} at ${pickupDate.toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;
    }
  };
  //function to pass data to parent element
  const handleTimer = (childTime: ValidTime) => {
    onSetTime(childTime);
    setSelectedTime(childTime);
  };

  return (
    <SheetCartC>
      <CustomTimeModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        hours={hours}
        index={index}
        cartGroup={cartGroup}
        onSetTime={handleTimer}
        role={role}
      />
      <SheetTrigger className="border-[1px] px-2 py-2 rounded-lg shadow-lg">
        {role === "PRODUCER" ? (
          selectedTime?.pickupTime ? (
            <>{formatPickupTime(selectedTime)}</>
          ) : (
            "Set Delivery Time"
          )
        ) : selectedTime?.pickupTime ? (
          <>{formatPickupTime(selectedTime)}</>
        ) : (
          "Set Pickup Time"
        )}
      </SheetTrigger>
      <SheetContentC
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        hours={hours}
        index={index}
        onSetTime={handleTimer}
        role={role}
        sodtarr={sodtarr}
      >
        <div onClick={() => setConfirmOpen(true)} className="h-full w-full">
          <SheetTrigger className="h-full w-full">
            <Card className="bg-inherit border-none">
              <CardHeader
                className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
              >
                {" "}
                {role === "PRODUCER"
                  ? `Set a custom delivery time`
                  : `Set a custom pickup time`}
              </CardHeader>
              <CardContent className={`${outfit.className} mt-2`}>
                {role === "PRODUCER"
                  ? `Don't need it ASAP? Feel free to set a delivery time anytime within the
                  freshness window of your cart items and this producers delivery
                  hours.`
                  : `Not in a rush? Feel free to set a pick up anytime within the
                  freshness window of your cart items and this co-op's open
                  hours.`}
              </CardContent>
            </Card>
          </SheetTrigger>
        </div>
      </SheetContentC>
    </SheetCartC>
  );
};

export default DateState;
