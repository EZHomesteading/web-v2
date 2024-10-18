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

interface StepSixProps {
  user: any;
  updateFormData: (newData: { location: LocationObj }) => void;
  formData: string[] | undefined;
  location?: LocationObj;
  selectedDays: string[];
  onComplete: () => void;
  onBack: () => void;
}

const StepSix: React.FC<StepSixProps> = ({
  user,
  updateFormData,
  formData,
  location,
  selectedDays,
  onComplete,
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
    <div className="h-full p-8">
      <div className="text-center text-4xl mb-8">
        Set Hours for Selected Days
      </div>
      <div className="mb-4">Selected Days: {selectedDays.join(", ")}</div>
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
      <Button
        onClick={() => {
          if (timeSlots.length >= 3) {
            toast.error(
              "You can only add up to three sets of hours for a day."
            );
            return;
          }
          if (checkOverlap([timeSlots])) {
            toast.error(
              "Cannot add another set of hours because existing time slots overlap."
            );
            return;
          }
          setTimeSlots((prev) => [...prev, { open: 540, close: 1020 }]);
        }}
        className="w-full mb-4"
      >
        Add Another Set of Hours
      </Button>
      <Button onClick={handleSaveChanges} className="w-full mb-4">
        Save Changes
      </Button>
    </div>
  );
};

export default StepSix;
