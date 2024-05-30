"use client";
//shadCN sheet component CUSTOMISED
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { IoReturnDownBack } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { Outfit } from "next/font/google";
import EarliestPickup from "@/app/(pages)/cart/components/earliest-pickup";
import { ExtendedHours } from "@/next-auth";

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
  hours: ExtendedHours;
  index: number;
  onSetTime: any;
}

const SheetContentC = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentCProps
>(
  (
    { side = "right", className, children, index, hours, onSetTime, ...props },
    ref
  ) => (
    <SheetPortalC>
      <SheetOverlayC />

      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <SheetPrimitive.Close className="rounded-lg lg:w-1/4 lg:h-1/4 h-1/3 w-full sm:w-3/4 mx-2 cursor-pointer flex flex-col items-center justify-center sm:justify-start opacity-95 hover:opacity-100 bg-green-100 text-center hover:bg-green-200">
          <EarliestPickup hours={hours} index={index} onSetTime={onSetTime} />
        </SheetPrimitive.Close>
        <div className="lg:w-1/4 lg:h-1/4 h-1/3 w-full sm:w-3/4 cursor-pointer flex flex-col items-center justify-center sm:justify-start opacity-95 hover:opacity-100 bg-green-100 text-center hover:bg-green-200 rounded-lg">
          {" "}
          {children}
        </div>

        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 text-white disabled:pointer-events-none data-[state=open]:bg-secondary">
          <IoReturnDownBack className="lg:h-15 lg:w-15 h-8 w-8" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortalC>
  )
);
SheetContentC.displayName = SheetPrimitive.Content.displayName;

const SheetHeaderC = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeaderC.displayName = "SheetHeader";

const SheetFooterC = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooterC.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  SheetCartC,
  SheetPortalC,
  SheetOverlayC,
  SheetTriggerC,
  SheetCloseC,
  SheetContentC,
  SheetHeaderC,
  SheetFooterC,
  SheetTitle,
  SheetDescription,
};
