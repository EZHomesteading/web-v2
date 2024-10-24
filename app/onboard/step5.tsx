import { useState, useCallback, useEffect } from "react";
import { LocationObj } from "@/next-auth";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import {
  PiCalendarBlankThin,
  PiCalendarCheckThin,
  PiCalendarPlusThin,
  PiCalendarThin,
  PiGearThin,
} from "react-icons/pi";
import OnboardHeader from "./header.onboard";

interface StepFourProps {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: Partial<{ selectedMonths: number[] }>) => void;
  formData: string[] | undefined;
  selectedMonths: number[] | undefined;
  fulfillmentStyle: string;
}

const StepFive = ({
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
    <div
      className={`${o.className} flex flex-col justify-start pt-2 sm:pt-[5%] h-full w-full `}
    >
      <div className="flex flex-col items-center w-full ">
        <div className="w-full max-w-[306.88px] sm:max-w-[402.88px] mt-4 mb-6">
          <div className="font-medium text-xl flex items-center gap-2">
            Select all months you plan to operate
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            Select a month if you'll be open any day during it{" "}
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            Fine-tune your daily schedule later in settings
          </div>
        </div>

        <div className="flex flex-col items-center h-[400px] sm:h-[530px]">
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
                className={`p-8 sm:p-12 rounded-xl border-[1px] shadow-md ${
                  openMonths.includes(index)
                    ? "bg-black text-white shadow-sm"
                    : "bg-white text-black"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getFulfillmentText = (fulfillmentStyle?: string) => {
  switch (fulfillmentStyle) {
    case "delivery":
      return "Delivery Only";
    case "pickup":
      return "Pickup Only";
    case "bothone":
      return "???";
    case "both":
      return "Same Hours for Both";
    default:
      return "";
  }
};
export { StepFive, getFulfillmentText };
