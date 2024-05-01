"use client";

import { SheetCartC } from "@/app/components/ui/sheet-cart";
import { SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { useState } from "react";

import { ExtendedHours } from "@/next-auth";
import CustomTime from "./DatePicker";
import "react-datetime-picker/dist/DateTimePicker.css";

interface StatusProps {
  hours: ExtendedHours;
  onSetTime: any;
}

const DateState = ({ hours, onSetTime }: StatusProps) => {
  const handleTimer = (childTime: Date) => {
    onSetTime(childTime);
  };

  return (
    <SheetCartC>
      <SheetTrigger className="border-[1px] px-2 py-2 rounded-lg w-fit shadow-lg text-black">
        Set Pickup Time
      </SheetTrigger>

      <CustomTime hours={hours} onSetTime={handleTimer} />
    </SheetCartC>
  );
};

export default DateState;
