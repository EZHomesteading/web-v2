import { Dispatch, SetStateAction, useState, useCallback } from "react";
import SliderSelection from "@/app/selling/(container-selling)/my-store/settings/slider-selection";
import { Location, Prisma } from "@prisma/client";
interface p {
  location: Location | null;
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
  const [openMonths, setOpenMonths] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleHoursChange = (newHours: any) => {
    let updatedLocation = { ...location, hours: newHours };
    setNewLocation(updatedLocation);
    updateFormData({ location: { 0: updatedLocation } });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const toggleMonth = useCallback((month: string) => {
    setOpenMonths((prevMonths) => {
      const newMonths = prevMonths.includes(month)
        ? prevMonths.filter((m) => m !== month)
        : [...prevMonths, month];
      return newMonths;
    });
  }, []);

  const handleMouseDown = (month: string) => {
    setIsDragging(true);
    toggleMonth(month);
  };

  const handleMouseEnter = (month: string) => {
    if (isDragging) {
      toggleMonth(month);
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
        Select the Months you will be open.
      </div>
      <div className="text-center text-2xl">
        You can change your schedule day-to-day in settings later on.
      </div>
      <div className="text-center text-2xl">
        Even if you are only open for one day out of a month, include that month
        in your selection.
      </div>
      <div className="flex flex-col items-center sm:mt-[3%] mt-[3%]">
        <div
          className="grid grid-cols-3 gap-2"
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
        >
          {months.map((month) => (
            <button
              key={month}
              onMouseDown={() => handleMouseDown(month)}
              onMouseEnter={() => handleMouseEnter(month)}
              className={`p-10 text-sm border-[2px] rounded ${
                openMonths.includes(month)
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSix;
