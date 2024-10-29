"use client";
//customised sheet trigger component
import { SheetCartC, SheetContentF } from "@/components/ui/review-sheet";
import { SheetTrigger } from "@/components/ui/sheet";

import "react-datetime-picker/dist/DateTimePicker.css";

interface StatusProps {
  reviewerId: string;
  reviewedId: string | undefined;
  buyer: boolean;
  orderId: string;
}

const ReviewButton = ({
  reviewedId,
  reviewerId,
  buyer,
  orderId,
}: StatusProps) => {
  return (
    <SheetCartC>
      <SheetTrigger
        asChild
        className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
      >
        Write a review
      </SheetTrigger>
      <SheetContentF
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        reviewedId={reviewedId}
        reviewerId={reviewerId}
        orderId={orderId}
        buyer={buyer}
      ></SheetContentF>
    </SheetCartC>
  );
};

export default ReviewButton;
