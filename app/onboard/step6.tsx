import React, {
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { LocationObj } from "@/next-auth";
import { Button } from "@/app/components/ui/button";

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
    <div className="h-full w-full p-8 flex flex-col  items-center">
      <div className=" mb-4 text-center items-center  pt-[2%] sm:pt-[5%] text-4xl">
        Select Days you will have{" "}
        {fulfillmentStyle === "delivery"
          ? "Delivery available from"
          : fulfillmentStyle === "pickup"
          ? "allow Pickups from"
          : fulfillmentStyle === "bothone"
          ? "Delivery available from"
          : fulfillmentStyle === "both"
          ? "Delivery and allow Pickups from"
          : null}{" "}
        {formData?.[0] || location?.address?.[0] || "Your Location"}
      </div>
      {weekDays.length < 7 ? (
        <div className="text-center py-[1%] sm:py-[1%] text-2xl">
          Would you like to set up Hours for any other days of the week?
        </div>
      ) : (
        <div className="text-center py-[1%] sm:py-[1%] text-2xl">
          Select the days of the week that will have the same hours
        </div>
      )}

      <div
        className="grid grid-cols-1 gap-2"
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {weekDays.map((day) => (
          <button
            key={day}
            onMouseDown={() => handleMouseDown(day)}
            onMouseEnter={() => handleMouseEnter(day)}
            className={`p-2 px-20 border-[2px] text-2xl rounded ${
              selectedDays.includes(day)
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      <Button onClick={handleNext} className=" mt-8 px-12 mb-4">
        Set Hours for Selected Days
      </Button>
      {weekDays.length === 7 ? null : (
        <Button onClick={onCompleteHours} className="px-12">
          I Am Finished Setting Hours
        </Button>
      )}
    </div>
  );
};

export default StepFive;
