import React, { useState } from "react";
import { LocationObj } from "@/next-auth";
import TimePicker from "@/app/selling/(container-selling)/availability-calendar/(components)/time-slot";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import {
  checkOverlap,
  convertMinutesToTimeString,
  convertTimeStringToMinutes,
} from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import OnboardHeader from "./header.onboard";

interface StepSixProps {
  user: any;
  updateFormData: (newData: { location: LocationObj }) => void;
  formData: string[] | undefined;
  location?: LocationObj;
  selectedDays: string[];
  fulfillmentStyle?: string;
  onComplete: () => void;
  onBack: () => void;
}

const StepSeven: React.FC<StepSixProps> = ({
  user,
  updateFormData,
  formData,
  location,
  selectedDays,
  onComplete,
  fulfillmentStyle,
  onBack,
}) => {
  const [timeSlots, setTimeSlots] = useState([{ open: 540, close: 1020 }]);

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleTimeSlotChange = (
    slotIndex: number,
    isOpenTime: boolean,
    newTime: string
  ) => {
    setTimeSlots((prevSlots) => {
      const newSlots = [...prevSlots];
      const minutes = convertTimeStringToMinutes(newTime);
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        [isOpenTime ? "open" : "close"]: minutes,
      };
      return newSlots;
    });
  };

  const handleSaveChanges = () => {
    if (checkOverlap([timeSlots])) {
      toast.error("Time slots overlap. Please adjust the hours.");
      return;
    }

    if (!location) {
      toast.error("Location data is missing.");
      return;
    }

    const updatedPickup = selectedDays.map((day) => {
      // Find the index of the day in the weekDays array
      const dayIndex = weekDays.indexOf(day);
      // Create a date for the next occurrence of this day
      const date = new Date();
      date.setDate(date.getDate() + ((dayIndex + 7 - date.getDay()) % 7));
      // Set the time to midnight to avoid timezone issues
      date.setHours(0, 0, 0, 0);

      return {
        date: date,
        timeSlots: timeSlots,
        capacity: null,
      };
    });

    const existingPickup = location.hours?.pickup || [];
    const newPickup = existingPickup.filter(
      (pickup) =>
        !selectedDays.includes(weekDays[new Date(pickup.date).getUTCDay()])
    );
    newPickup.push(...updatedPickup);

    const updatedLocation: LocationObj = {
      ...location,
      hours: {
        pickup: newPickup,
        delivery: location.hours?.delivery || [],
      },
    };

    updateFormData({ location: updatedLocation });
    toast.success("Store hours updated successfully");
    onComplete();
  };

  return (
    <div
      className={`${o.className} flex flex-col justify-start pt-2 sm:pt-[5%] h-full w-full `}
    >
      <div className="flex flex-col items-center w-full ">
        <div className="w-full max-w-[306.88px] sm:max-w-[402.88px] mt-4 mb-6">
          <div className="font-medium text-xl flex items-center gap-2">
            Set Open & Close Hours for
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            {selectedDays.join(", ")}
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal mb-6">
            Fine-tune your daily schedule later in settings
          </div>
          {/* <div className="mb-4">Selected Days: </div> */}
          {timeSlots.map((slot, index) => (
            <div key={index} className="mb-4">
              <TimePicker
                top={true}
                value={convertMinutesToTimeString(slot.open)}
                onChange={(time) => handleTimeSlotChange(index, true, time)}
                isOpen={true}
              />
              <TimePicker
                top={false}
                value={convertMinutesToTimeString(slot.close)}
                onChange={(time) => handleTimeSlotChange(index, false, time)}
                isOpen={true}
              />
            </div>
          ))}
          {timeSlots.length >= 3 ? null : (
            <Button
              onClick={() => {
                if (checkOverlap([timeSlots])) {
                  toast.error(
                    "Cannot add another set of hours because existing time slots overlap."
                  );
                  return;
                }
                setTimeSlots((prev) => [...prev, { open: 540, close: 1020 }]);
              }}
              className="px-12 mb-4"
            >
              Add Another Set of Hours
            </Button>
          )}
          <Button onClick={handleSaveChanges} className="px-12 mb-4">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepSeven;
