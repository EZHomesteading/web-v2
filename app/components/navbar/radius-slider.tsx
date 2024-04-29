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
    <div>
      <div className="mb-3">Radius</div>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-4/5 touch-none select-none items-center",
          className
        )}
        value={value}
        onValueChange={onValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-[1px] grow overflow-hidden rounded-full bg-black">
          <SliderPrimitive.Range className="absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-[1px] border-gray-500 bg-white" />
      </SliderPrimitive.Root>
      <div>
        {value} {unit(singleValue)}
      </div>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
