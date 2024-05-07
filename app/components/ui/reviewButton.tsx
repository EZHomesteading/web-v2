"use client";

import { SheetCartC, SheetContentF } from "@/app/components/ui/review-sheet";
import { SheetTrigger } from "@/app/components/ui/sheet";
import { useState } from "react";

import "react-datetime-picker/dist/DateTimePicker.css";

interface StatusProps {
  user: any;
  buyer: boolean;
}

const ReviewButton = ({ user, buyer }: StatusProps) => {
  return (
    <SheetCartC>
      <SheetTrigger className="border-[1px] px-2 py-2 rounded-lg shadow-lg">
        Write a review
      </SheetTrigger>
      <SheetContentF
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        user={user}
        buyer={buyer}
      ></SheetContentF>
    </SheetCartC>
  );
};

export default ReviewButton;
