import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  value?: number[];
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, value, onValueChange, ...props }, ref) => {
  const unit = (singleValue: number) => (singleValue === 1 ? "mile" : "miles");
  const singleValue = Array.isArray(value) ? value[0] : value || 0;

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-medium">Radius</span>
        <span className="text-sm font-medium text-gray-600">
          {singleValue} {unit(singleValue)}
        </span>
      </div>

      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={value}
        onValueChange={onValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-emerald-950/70" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-950/70 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-950/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{props.min} mile</span>
        <span>{props.max} miles</span>
      </div>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
