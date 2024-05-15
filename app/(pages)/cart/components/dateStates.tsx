"use client";

import { SheetCartC, SheetContentC } from "@/app/components/ui/sheet-cart";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { SheetTrigger } from "@/app/components/ui/sheet";
import { useState } from "react";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";
import "react-datetime-picker/dist/DateTimePicker.css";
import CustomTimeModal from "./customTimeModal";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface StatusProps {
  hours: ExtendedHours;
  onSetTime: any;
  index: number;
  cartGroup: CartGroup | null;
}

const DateState = ({ hours, cartGroup, onSetTime, index }: StatusProps) => {
  const [selectedTime, setSelectedTime] = useState<any>(); //users selected time
  const [confirmOpen, setConfirmOpen] = useState(false);
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
      <CustomTimeModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        hours={hours}
        index={index}
        cartGroup={cartGroup}
        onSetTime={handleTimer}
      />
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
        <div onClick={() => setConfirmOpen(true)} className="h-full w-full">
          <SheetTrigger className="h-full w-full">
            <Card className="bg-inherit border-none">
              <CardHeader
                className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
              >
                Set a custom pickup time{" "}
              </CardHeader>
              <CardContent className={`${outfit.className} mt-2`}>
                Not in a rush? Feel free to set a pick up anytime within the
                freshness window of your cart items and this co-op&apos;s open
                hours.
              </CardContent>
            </Card>
          </SheetTrigger>
        </div>
        {/* <CustomTime
          hours={hours}
          index={index}
          cartGroup={cartGroup}
          onSetTime={handleTimer}
        /> */}
      </SheetContentC>
    </SheetCartC>
  );
};

export default DateState;
