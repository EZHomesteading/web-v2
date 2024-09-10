//shadCN checkbox component
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: string; // Adding label prop for usability
  }
>(({ className, label, ...props }, ref) => (
  <div className="flex items-center gap-2 ">
    {" "}
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-10 w-10 shrink-0 rounded-md !border-gray-600 border-[2px] border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-emerald-800 data-[state=checked]:text-primary-foreground ",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current bg-emeral-950"
        )}
      >
        <CheckIcon className="h-5 w-5 text-white" />{" "}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {label && (
      <label className="select-none text-sm !text-gray-800 cursor-pointer">
        {label}
      </label>
    )}
  </div>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
