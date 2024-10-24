import React, {
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { LocationObj } from "@/next-auth";
import { Button } from "@/app/components/ui/button";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { getFulfillmentText } from "./step5";
import OnboardHeader from "./header.onboard";

interface StepFiveProps {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: { location: LocationObj }) => void;
  formData: string[] | undefined;
  onComplete: (selectedDays: string[]) => void;
  onCompleteHours: () => void;
  selectedDays: string[];
  prevSelectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
  fulfillmentStyle: string;
}

const StepFive: React.FC<StepFiveProps> = ({
  user,
  updateFormData,
  formData,
  location,
  onComplete,
  onCompleteHours,
  selectedDays,
  setSelectedDays,
  fulfillmentStyle,
  prevSelectedDays,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const fullWeekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [weekDays, setWeekDays] = useState<string[]>(fullWeekDays);

  useEffect(() => {
    if (prevSelectedDays.length !== 0) {
      setWeekDays(
        fullWeekDays.filter((day) => !prevSelectedDays.includes(day))
      );
    } else {
      setWeekDays(fullWeekDays);
    }
  }, [location]);
  console.log("selected days on step 6", selectedDays);
  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  }, []);

  const handleMouseDown = (day: string) => {
    setIsDragging(true);
    toggleDay(day);
  };

  const handleMouseEnter = (day: string) => {
    if (isDragging) {
      toggleDay(day);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNext = () => {
    if (selectedDays.length === 0) {
      alert("Please select at least one day.");
      return;
    }
    onComplete(selectedDays);
  };

  return (
    <div
      className={`${o.className} flex flex-col justify-start pt-2 sm:pt-[5%] h-full w-full `}
    >
      <div className="flex flex-col items-center w-full ">
        <div className="w-full max-w-[306.88px] sm:max-w-[402.88px] mt-4 mb-6">
          <div className="font-medium text-xl flex items-center gap-2">
            Select Days with the Same Hours
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            You'll return here to set hours for additional days until your
            schedule is complete
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            Fine-tune your daily schedule later in settings
          </div>

          <div
            className="grid grid-cols-1 gap-2 mt-6"
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            {weekDays.map((day) => (
              <button
                key={day}
                onMouseDown={() => handleMouseDown(day)}
                onMouseEnter={() => handleMouseEnter(day)}
                className={`p-2 px-20 border-[1px] text-2xl rounded-md shadow-sm ${
                  selectedDays.includes(day)
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="mt-2 space-y-2">
            <div
              className={`transition-all duration-500 ${
                selectedDays.length > 0
                  ? "opacity-100 h-12"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              <Button onClick={handleNext} className="h-12 w-full">
                Set Hours for Selected Days
              </Button>
            </div>

            <div
              className={`transition-all duration-500 ${
                weekDays.length !== 7
                  ? "opacity-100 h-12"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              <Button
                onClick={onCompleteHours}
                className="h-12 w-full bg-green-200/40 text-black border"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFive;
