"use client";
import { Slider } from "@/app/components/ui/slider";
import { useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
type CoopHoursSliderProps = {
  day: string;
  open: number;
  close: number;
  onChange: (open: number, close: number) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
};

export default function CoopHoursSlider({
  day,
  open,
  close,
  onChange,
  onNextDay,
  onPrevDay,
}: CoopHoursSliderProps) {
  const [values, setValues] = useState([open, close]);

  const handleChange = (newValues: number[]) => {
    setValues(newValues);
    onChange(newValues[0], newValues[1]);
  };

  return (
    <div className="space-y-2">
      <div>{day}</div>
      <Slider
        defaultValue={[open, close]}
        min={0}
        max={1440}
        step={15}
        minStepsBetweenThumbs={2}
        onValueChange={handleChange}
        className="w-[300px]"
      />
      <div className="flex justify-between">
        <div>{formatTime(values[0])}</div>
        <div>{formatTime(values[1])}</div>
      </div>
      <div className="flex justify-evenly">
        <button onClick={onPrevDay}>
          <MdOutlineNavigateBefore className="h-8 w-8" />
        </button>
        <button onClick={onNextDay}>
          <MdOutlineNavigateNext className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}
