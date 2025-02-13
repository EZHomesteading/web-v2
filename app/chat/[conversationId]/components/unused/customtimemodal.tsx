import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import TimePicker from "./time.picker";

interface TimeSlot {
  open: number;
  close: number;
}

interface AvailabilityDay {
  date: Date | string;
  capacity: number | null;
  timeSlots: TimeSlot[];
}

interface Hours {
  pickup: AvailabilityDay[];
  delivery: AvailabilityDay[];
}

interface DateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
  isOpen: boolean;
  onClose: () => void;
  hours: Hours | null | undefined;
  type?: "pickup" | "delivery";
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onSelect,
  isOpen,
  onClose,
  hours,
  type = "pickup",
}) => {
  const [step, setStep] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const [tempTime, setTempTime] = useState(selectedTime);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // Normalize date for comparison (strip time)
  const normalizeDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // Update available dates when hours change
  useEffect(() => {
    if (hours && hours[type]) {
      const dates = hours[type]
        .filter((day) => day.timeSlots.length > 0)
        .map((day) => new Date(day.date));
      setAvailableDates(dates);
    } else {
      setAvailableDates([]);
    }
  }, [hours, type]);

  // Function to convert minutes since midnight to 12-hour format time string
  const minutesToTimeString = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  // Get the first available time for the selected date
  const getFirstAvailableTime = (date: Date | undefined): string => {
    if (!date || !hours) return "12:00 PM";

    const dateString = normalizeDate(date);
    const availableDay = hours[type]?.find(
      (day) => normalizeDate(day.date) === dateString
    );

    if (availableDay?.timeSlots && availableDay.timeSlots.length > 0) {
      return minutesToTimeString(availableDay.timeSlots[0].open);
    }

    return "12:00 PM";
  };

  // Update the time when date changes
  useEffect(() => {
    if (step === "time" && tempDate) {
      const firstAvailableTime = getFirstAvailableTime(tempDate);
      setTempTime(firstAvailableTime);
    }
  }, [step, tempDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Check if the selected date is available
      const isAvailable = availableDates.some(
        (availableDate) => normalizeDate(availableDate) === normalizeDate(date)
      );

      if (isAvailable) {
        setTempDate(date);
      }
    } else {
      setTempDate(undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    setTempTime(time);
  };

  const handleNext = () => {
    if (step === "date" && tempDate) {
      setStep("time");
    } else if (step === "time" && tempDate) {
      const [timeStr, period] = tempTime.split(" ");
      const [hours, minutes] = timeStr.split(":").map((num) => parseInt(num));

      let hour24 = hours;
      if (period === "PM" && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === "AM" && hours === 12) {
        hour24 = 0;
      }

      const dateWithTime = new Date(tempDate);
      dateWithTime.setHours(hour24);
      dateWithTime.setMinutes(minutes);
      dateWithTime.setSeconds(0);
      dateWithTime.setMilliseconds(0);

      onSelect(
        dateWithTime.toISOString().split("T")[0],
        `${hour24.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
      );
      onClose();
      setStep("date");
    }
  };

  const handleBack = () => {
    if (step === "time") {
      setStep("date");
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable dates not in available dates
    return !availableDates.some(
      (availableDate) => normalizeDate(availableDate) === normalizeDate(date)
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[10000]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="bg-white rounded-3xl border shadow-xl w-[90vw] max-w-[450px] h-[600px] overflow-hidden m-4"
            >
              <div className="relative h-full bg-white rounded-3xl flex flex-col px-6 pb-6 pt-14">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-black bg-white p-2 rounded-full 
                            shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {step === "date" ? "Select Date" : "Select Time"}
                  </h2>
                  {tempDate && step === "time" && (
                    <p className="text-sm text-gray-500">
                      {tempDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center">
                  {step === "date" ? (
                    <div className="w-full max-w-sm mx-auto">
                      <Calendar
                        mode="single"
                        selected={tempDate}
                        onSelect={handleDateSelect}
                        className="rounded-md border shadow"
                        disabled={isDateDisabled}
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-sm mx-auto">
                      <TimePicker
                        top={false}
                        value={tempTime}
                        onChange={handleTimeSelect}
                        isOpen={true}
                        selectedDate={tempDate?.toISOString().split("T")[0]}
                        hours={hours}
                        type={type}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  {step === "time" ? (
                    <Button variant="outline" onClick={handleBack}>
                      Back to Calendar
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={!tempDate || (step === "time" && !tempTime)}
                    className="flex items-center gap-2"
                  >
                    {step === "date" ? "Next" : "Confirm"}
                    {step === "date" && <ChevronRight size={16} />}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DateTimePicker;
