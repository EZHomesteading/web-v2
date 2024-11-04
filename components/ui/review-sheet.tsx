"use client";
//shadCN  review sheet component CUSTOMISED
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Outfit, Zilla_Slab } from "next/font/google";
import ReactStars from "react-stars";
import axios from "axios";
import { Textarea } from "./textarea";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});
const zilla = Zilla_Slab({
  weight: ["300"],
  display: "auto",
  subsets: ["latin"],
});
const SheetCartC = SheetPrimitive.Root;

const SheetTriggerC = SheetPrimitive.Trigger;

const SheetCloseC = SheetPrimitive.Close;

const SheetPortalC = SheetPrimitive.Portal;

const SheetOverlayC = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlayC.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background py-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentCProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  reviewerId: string;
  reviewedId: string | undefined;
  buyer: boolean;
  orderId?: string;
}

const SheetContentF = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentCProps
>(
  (
    {
      side = "right",
      className,
      children,
      reviewedId,
      reviewerId,
      orderId,
      buyer,
      ...props
    },
    ref
  ) => {
    const [rating, setRating] = React.useState(0);
    const [text, setText] = React.useState("");
    const [showSheet, setShowSheet] = React.useState(true);

    const handleRatingChange = (newRating: any) => {
      setRating(newRating);
    };

    const handleTextChange = (e: any) => {
      setText(e.target.value);
    };

    const handleSubmit = () => {
      if (rating === 0 || text.trim() === "") {
        return;
      }
      axios.post("/api/useractions/review", {
        rating: rating,
        review: text,
        reviewedId: reviewedId,
        reviewerId: reviewerId,
        buyer: buyer,
      });
      axios.post("/api/useractions/checkout/update-order", {
        orderId: orderId,
        status: 19,
        completedAt: new Date(),
      });
      closeSheet();
    };

    const closeSheet = () => {
      setShowSheet(false);
    };

    if (!showSheet) return null;
    return (
      <SheetPortalC>
        <SheetOverlayC />
        <SheetPrimitive.Content
          ref={ref}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          <div className="rounded-lg p-2 mx-2 cursor-pointer w-5/6 sm:w-2/3 lg:w-1/3 2xl:w-1/6 h-fit flex flex-col items-center opacity-100 bg-slate-300">
            <div className={`${outfit.className} text-2xl`}>Leave a Review</div>
            <div>
              <ReactStars
                count={5}
                size={24}
                color2={"#ffd700"}
                value={rating}
                onChange={handleRatingChange}
                half={false}
                edit={true}
              />
            </div>
            <Textarea
              className={`${zilla.className} w-full h-[300px] m-2 resize-none p-2 text-[1rem]`}
              value={text}
              onChange={handleTextChange}
              maxLength={500}
            />
            <div className={`${outfit.className}`}>
              <SheetCloseC className="m-5 bg-slate-600 text-white rounded-full py-1 px-4">
                Close
              </SheetCloseC>
              <button
                className="m-5 bg-slate-600 text-white rounded-full py-1 px-4"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPortalC>
    );
  }
);
SheetContentF.displayName = SheetPrimitive.Content.displayName;

export {
  SheetCartC,
  SheetPortalC,
  SheetOverlayC,
  SheetTriggerC,
  SheetCloseC,
  SheetContentF,
};
