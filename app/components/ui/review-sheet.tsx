"use client";
//shadCN  review sheet component CUSTOMISED
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Outfit } from "next/font/google";
import ReactStars from "react-stars";
import axios from "axios";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
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
  reviewedId: string;
  buyer: boolean;
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
      axios.post("/api/review", {
        rating: rating,
        review: text,
        reviewedId: reviewedId,
        reviewerId: reviewerId,
        buyer: buyer,
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
          <div className="rounded-lg lg:w-1/2 lg:h-1/3 h-1/3 w-full sm:w-3/4 mx-2 cursor-pointer flex flex-col items-center justify-center sm:justify-start opacity-95 hover:opacity-100 bg-green-100 text-center hover:bg-green-200">
            <div>Write your review</div>
            <div>
              <h2>Star Rating</h2>
              <ReactStars
                count={5}
                size={24}
                color2={"#ffd700"}
                value={rating}
                onChange={handleRatingChange}
                half={false}
              />
            </div>
            <textarea
              className="w-[98%] h-[60%] m-2 resize-none p-2"
              value={text}
              onChange={handleTextChange}
            ></textarea>
            <div>
              <SheetCloseC>
                <button className="m-5">Close</button>
              </SheetCloseC>
              <button className="m-5" onClick={handleSubmit}>
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
