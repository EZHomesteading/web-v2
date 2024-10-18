import React, { useState, useCallback, useEffect } from "react";
import { LocationObj } from "@/next-auth";
import { Button } from "@/app/components/ui/button";

interface StepFiveProps {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: { location: LocationObj }) => void;
  formData: string[] | undefined;
  onComplete: (selectedDays: string[]) => void;
  onCompleteHours: () => void;
}

const StepFive: React.FC<StepFiveProps> = ({
  user,
  updateFormData,
  formData,
  location,
  onComplete,
  onCompleteHours,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
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
    if (location?.hours?.pickup) {
      const setupDays = location.hours.pickup.map((day) => {
        const date = new Date(day.date);
        // Use UTC methods to avoid timezone issues
        return fullWeekDays[date.getUTCDay()];
      });
      setWeekDays(fullWeekDays.filter((day) => !setupDays.includes(day)));
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
    <div className="h-full p-8">
      <div className="text-center text-4xl mb-8">
        Select Days for{" "}
        {formData?.[0] || location?.address?.[0] || "Your Location"}
      </div>
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
      <Button onClick={handleNext} className="w-full mt-8 mb-4">
        Set Hours for Selected Days
      </Button>
      <Button onClick={onCompleteHours} className="w-full">
        I Am Finished Setting Hours
      </Button>
    </div>
  );
};

export default StepFive;
