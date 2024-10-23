import { useState, useCallback, useEffect } from "react";
import { LocationObj } from "@/next-auth";
import { UserRole } from "@prisma/client";

interface StepFourProps {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: Partial<{ selectedMonths: number[] }>) => void;
  formData: string[] | undefined;
  selectedMonths: number[] | undefined;
  fulfillmentStyle: string;
}

const StepFive = ({
  user,
  updateFormData,
  formData,
  location,
  selectedMonths,
  fulfillmentStyle,
}: StepFourProps) => {
  const [openMonths, setOpenMonths] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  // Initialize openMonths with selectedMonths when the component mounts
  useEffect(() => {
    if (selectedMonths && selectedMonths.length > 0) {
      setOpenMonths(selectedMonths);
    }
  }, [selectedMonths]);

  const toggleMonth = useCallback((monthIndex: number) => {
    setOpenMonths((prevMonths) => {
      const newMonths = prevMonths.includes(monthIndex)
        ? prevMonths.filter((m) => m !== monthIndex)
        : [...prevMonths, monthIndex];
      return newMonths;
    });
  }, []);

  const handleMouseDown = (monthIndex: number) => {
    setIsDragging(true);
    toggleMonth(monthIndex);
  };

  const handleMouseEnter = (monthIndex: number) => {
    if (isDragging) {
      toggleMonth(monthIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    updateFormData({
      selectedMonths: openMonths,
    });
  }, [openMonths, updateFormData]);

  return (
    <div className="h-full">
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Set Up Months you will be{" "}
        {fulfillmentStyle === "delivery"
          ? "Delivering from"
          : fulfillmentStyle === "pickup"
          ? "allowing Pickups at"
          : fulfillmentStyle === "bothone"
          ? "Delivering from"
          : fulfillmentStyle === "both"
          ? "Delivering from and allowing Pickups at"
          : null}{" "}
        {formData?.[0] || location?.address?.[0] || "Your Location"}
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
          {months.map((month, index) => (
            <button
              key={month}
              onMouseDown={() => handleMouseDown(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              className={`p-10 text-sm border-[2px] rounded ${
                openMonths.includes(index)
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

export default StepFive;
