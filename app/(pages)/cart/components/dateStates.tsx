"use client";

import { SheetCartC, SheetContentC } from "@/app/components/ui/sheet-cart";
import { Sheet, SheetTrigger } from "@/app/components/ui/sheet";
import { useEffect, useState } from "react";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";
import CustomTime from "./custom-time";
import "react-datetime-picker/dist/DateTimePicker.css";

interface StatusProps {
  hours: ExtendedHours;
  onSetTime: any;
  index: number;
  cartGroup: CartGroup | null;
}

const DateState = ({ hours, cartGroup, onSetTime, index }: StatusProps) => {
  const [selectedTime, setSelectedTime] = useState<any>(); //users selected time

  const formatPickupTime = (selectedTime: any) => {
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

  const handleTimer = (childTime: Date) => {
    onSetTime(childTime);
    setSelectedTime(childTime);
  };

  return (
    <SheetCartC>
      <SheetTrigger className="border-[1px] px-2 py-2 rounded-lg shadow-lg">
        {selectedTime?.pickupTime ? (
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
      >
        <Sheet>
          <CustomTime
            hours={hours}
            index={index}
            cartGroup={cartGroup}
            onSetTime={handleTimer}
          />
        </Sheet>
      </SheetContentC>
    </SheetCartC>
  );
};

export default DateState;
