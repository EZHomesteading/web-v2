import { Dispatch, SetStateAction, useState, useCallback } from "react";
import SliderSelection from "@/app/selling/(container-selling)/my-store/settings/slider-selection";
import { Location, Prisma } from "@prisma/client";
import { LocationObj } from "@/next-auth";
interface p {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: Partial<{ location: any }>) => void;
  formData: string[] | undefined;
  setOpenMonths: Dispatch<SetStateAction<string[]>>;
}

const StepSix = ({
  user,
  updateFormData,
  // setOpenMonths,
  formData,
  location,
}: p) => {
  const [newLocation, setNewLocation] = useState(user?.location?.[0] || null);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDaysChange = (newDays: any) => {
    let updatedLocation = { ...location, hours: newDays };
    setNewLocation(updatedLocation);
    updateFormData({ location: { 0: updatedLocation } });
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleMonth = useCallback((days: string) => {
    setOpenDays((prevDays) => {
      const newDays = prevDays.includes(days)
        ? prevDays.filter((d) => d !== days)
        : [...prevDays, days];
      return newDays;
    });
  }, []);

  const handleMouseDown = (days: string) => {
    setIsDragging(true);
    toggleMonth(days);
  };

  const handleMouseEnter = (days: string) => {
    if (isDragging) {
      toggleMonth(days);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-full">
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Set Up Your Store Hours for{" "}
        {formData && formData[0]
          ? `${formData[0]}`
          : user.locations
          ? user.locations[1].address[1]
          : "no location set"}
      </div>
      <div className="text-center pt-[1%] sm:pt-[1%] text-2xl">
        Select Days of the week that will have the same hours.
      </div>
      <div className="text-center text-2xl">
        For days with different hours you will be able to select those later.
      </div>
      <div className="flex flex-col items-center sm:mt-[2%] mt-[2%]">
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
              className={`p-2 px-20  border-[2px] text-2xl rounded ${
                openDays.includes(day)
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSix;
