"use client";
import { Slider } from "@/app/components/ui/slider";
import { Outfit } from "next/font/google";
import { useEffect, useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
type CoopHoursSliderProps = {
  day: string;
  hours: { open: number; close: number };
  onChange: (open: number, close: number) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
};

export default function CoopHoursSlider({
  day,
  hours,
  onChange,
  onNextDay,
  onPrevDay,
}: CoopHoursSliderProps) {
  const [values, setValues] = useState([hours.open, hours.close]);
  useEffect(() => {
    setValues([hours.open, hours.close]);
  }, [hours]);

  const handleChange = (newValues: number[]) => {
    setValues(newValues);
    onChange(newValues[0], newValues[1]);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-row justify-center items-center">
        <div className="flex justify-end w-12">
          <button onClick={onPrevDay} className="mr-2">
            <MdOutlineNavigateBefore className="h-10 w-10" />
          </button>
        </div>
        <div
          className={`${outfit.className} flex justify-center text-xl sm:text-2xl`}
        >
          Primary {day} Hours
        </div>
        <div className="flex justify-end w-12">
          <button onClick={onNextDay} className="ml-2">
            <MdOutlineNavigateNext className="h-10 w-10 " />
          </button>
        </div>
      </div>
      <div className="relative">
        {values[0] !== undefined && (
          <>
            <Slider
              value={values}
              min={0}
              max={1439}
              step={15}
              minStepsBetweenThumbs={2}
              onValueChange={handleChange}
              className="w-full"
            />

            <>
              <div
                className={`${outfit.className} absolute top-6 left-0 right-0 flex justify-between`}
              >
                <div>{formatTime(values[0])}</div>
                <div>{formatTime(values[1])}</div>
              </div>
            </>
          </>
        )}{" "}
      </div>
    </div>
  );
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  return `${formattedHours}:${formattedMins} ${ampm}`;
};
