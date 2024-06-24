"use client";
//coop hours slider component
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
  hours?: { open: number; close: number };
  onChange: (open: number, close: number) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
  isOpen: boolean;
};

export default function CoopHoursSlider({
  day,
  hours,
  onChange,
  onNextDay,
  onPrevDay,
  isOpen,
}: CoopHoursSliderProps) {
  const [values, setValues] = useState<any>();

  useEffect(() => {
    if (hours) {
      setValues([hours.open, hours.close]);
    }
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
          {isOpen ? <>Primary {day} Hours</> : <>Closed on {day}</>}
        </div>
        <div className="flex justify-end w-12">
          <button onClick={onNextDay} className="ml-2">
            <MdOutlineNavigateNext className="h-10 w-10 " />
          </button>
        </div>
      </div>
      <div className="relative">
        {isOpen && values && (
          <>
            <Slider
              value={values}
              min={0}
              max={1439}
              step={15}
              minStepsBetweenThumbs={4}
              onValueChange={handleChange}
              className="w-full"
            />
            <div
              className={`${outfit.className} absolute top-[.9rem] left-0 right-0 flex justify-between`}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${(values[0] / 1439) * 100}%`,
                  transform: "translateX(-50%)",
                  zIndex: values[0] > values[1] - 60 ? 2 : 1,
                  backgroundColor: "rgb(20 83 45)",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  color: "white",
                }}
              >
                {formatTime(values[0])}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: `${(values[1] / 1439) * 100}%`,
                  transform: "translateX(-50%)",
                  zIndex: values[1] < values[0] + 60 ? 2 : 1,
                  backgroundColor: "rgb(127 29 29)",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  color: "white",
                }}
              >
                {formatTime(values[1])}
              </div>
            </div>
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
