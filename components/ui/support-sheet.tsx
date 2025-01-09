"use client";
//shadCN sheet component CUSTOMISED
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  email: string;
}

const SheetContentS = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentCProps
>(({ side = "right", className, children, email, ...props }, ref) => {
  const [text, setText] = React.useState("");
  const [text1, setText1] = React.useState("");
  const [text2, setText2] = React.useState(`${email}`);
  const [showSheet, setShowSheet] = React.useState(true);

  function isValidEmail(email: string) {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the pattern
    if (emailPattern.test(email)) {
      // Email is valid
      return true;
    } else {
      // Email is invalid
      return false;
    }
  }

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };
  const handleText1Change = (e: any) => {
    setText1(e.target.value);
  };
  const handleText2Change = (e: any) => {
    setText2(e.target.value);
  };

  const handleSubmit = () => {
    if (text2.trim() === "" || text1.trim() === "" || text.trim() === "") {
      toast.error("One or more fields have been left blank");
      return;
    }
    if (isValidEmail(text2) === false) {
      toast.error("Invalid email");
      return;
    }
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
        <div className="rounded-lg lg:w-1/2 lg:h-1/2 h-1/2 w-full sm:w-3/4 mx-2 cursor-pointer flex flex-col items-center justify-center sm:justify-start opacity-95 hover:opacity-100 bg-green-100 text-center hover:bg-green-200">
          <div className="pt-[10px]"> Your Email</div>
          <textarea
            className="w-[98%] h-[65px] m-2 resize-none p-2"
            value={text2}
            onChange={handleText2Change}
          ></textarea>
          <div> Email Subject</div>
          <textarea
            className="w-[98%] h-[65px] m-2 resize-none p-2"
            value={text1}
            onChange={handleText1Change}
          ></textarea>
          <div> Email Body</div>
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
});
SheetContentS.displayName = SheetPrimitive.Content.displayName;

export {
  SheetCartC,
  SheetPortalC,
  SheetOverlayC,
  SheetTriggerC,
  SheetCloseC,
  SheetContentS,
};
