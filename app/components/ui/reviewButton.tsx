"use client";
//customised sheet trigger component
import { SheetCartC, SheetContentF } from "@/app/components/ui/review-sheet";
import { SheetTrigger } from "@/app/components/ui/sheet";

import "react-datetime-picker/dist/DateTimePicker.css";

interface StatusProps {
  reviewerId: string;
  reviewedId: string;
  buyer: boolean;
}

const ReviewButton = ({ reviewedId, reviewerId, buyer }: StatusProps) => {
  return (
    <SheetCartC>
      <SheetTrigger className="border-[1px] bg-neutral-100 text-black px-2 py-2 rounded-lg shadow-lg">
        Write a review
      </SheetTrigger>
      <SheetContentF
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        reviewedId={reviewedId}
        reviewerId={reviewerId}
        buyer={buyer}
      ></SheetContentF>
    </SheetCartC>
  );
};

export default ReviewButton;
