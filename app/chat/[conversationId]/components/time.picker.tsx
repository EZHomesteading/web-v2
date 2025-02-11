import { useState, useEffect, useCallback } from "react";
import { OutfitFont } from "@/components/fonts";
import Wheel from "./wheel";

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

interface TimePickerProps {
  top?: boolean;
  value: string;
  onChange: (time: string) => void;
  isOpen: boolean;
  selectedDate?: string;
  hours: Hours | null | undefined;
  type?: "pickup" | "delivery";
}

// Utility functions
const normalizeDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
};

// Convert 24-hour time to 12-hour format
const formatHour = (hour24: number): { hour12: string; period: string } => {
  let hour = hour24 % 12;
  if (hour === 0) hour = 12;
  return {
    hour12: hour.toString().padStart(2, "0"),
    period: hour24 >= 12 ? "PM" : "AM",
  };
};

// Parse time string to components
const parseTimeString = (timeStr: string) => {
  const [time, period] = timeStr.split(" ");
  const [hour, minute] = time.split(":");
  return {
    hour: hour.padStart(2, "0"),
    minute: minute.padStart(2, "0"),
    period,
  };
};

// Function to get first available time
const getInitialTime = (
  hours: Hours | null | undefined,
  type: "pickup" | "delivery",
  selectedDate: string | undefined,
  value: string
) => {
  if (hours?.[type] && selectedDate) {
    const availableDay = hours[type].find(
      (day) => normalizeDate(day.date) === normalizeDate(selectedDate)
    );

    if (availableDay?.timeSlots?.[0]) {
      const firstSlot = availableDay.timeSlots[0];
      const hour = Math.floor(firstSlot.open / 60);
      const minute = firstSlot.open % 60;
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return {
        hour: hour12.toString().padStart(2, "0"),
        minute: minute.toString().padStart(2, "0"),
        period,
      };
    }
  }
  return parseTimeString(value || "08:00 AM");
};

const TimePicker: React.FC<TimePickerProps> = ({
  top = true,
  value,
  onChange,
  isOpen,
  selectedDate,
  hours,
  type = "pickup",
}) => {
  const initialTime = getInitialTime(hours, type, selectedDate, value);
  const [selectedHour, setSelectedHour] = useState<string>(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState<string>(
    initialTime.minute
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    initialTime.period
  );
  const [disabledHours, setDisabledHours] = useState<string[]>([]);
  const [disabledMinutes, setDisabledMinutes] = useState<string[]>([]);

  // Normalize date strings for comparison
  const normalizeDate = (dateStr: string | Date): string => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  // Convert 24-hour time to 12-hour format
  const formatHour = (hour24: number): { hour12: string; period: string } => {
    let hour = hour24 % 12;
    if (hour === 0) hour = 12;
    return {
      hour12: hour.toString().padStart(2, "0"),
      period: hour24 >= 12 ? "PM" : "AM",
    };
  };

  // Convert 12-hour time to minutes since midnight
  const timeToMinutes = (
    hour: string,
    minute: string,
    period: string
  ): number => {
    let hour24 = parseInt(hour);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return hour24 * 60 + parseInt(minute);
  };

  // Calculate available times based on time slots
  useEffect(() => {
    if (!hours?.[type] || !selectedDate) {
      setDisabledHours(generateHours());
      setDisabledMinutes(generateMinutes());
      return;
    }

    const normalizedSelectedDate = normalizeDate(selectedDate);

    const todaySlots =
      hours[type].find(
        (day) => normalizeDate(day.date) === normalizedSelectedDate
      )?.timeSlots || [];

    if (todaySlots.length === 0) {
      setDisabledHours(generateHours());
      setDisabledMinutes(generateMinutes());
      return;
    }

    // Calculate available hours and minutes
    const currentMinutes = timeToMinutes(
      selectedHour,
      selectedMinute,
      selectedPeriod
    );
    const availableHours = new Set<string>();
    const availableMinutes = new Set<string>();

    todaySlots.forEach((slot) => {
      for (let min = slot.open; min <= slot.close; min += 15) {
        const hour24 = Math.floor(min / 60);
        const { hour12, period } = formatHour(hour24);

        if (period === selectedPeriod) {
          availableHours.add(hour12);

          // Only add minutes for the selected hour
          if (hour12 === selectedHour) {
            const minuteStr = (min % 60).toString().padStart(2, "0");
            if (generateMinutes().includes(minuteStr)) {
              availableMinutes.add(minuteStr);
            }
          }
        }
      }
    });

    setDisabledHours(
      generateHours().filter((hour) => !availableHours.has(hour))
    );
    setDisabledMinutes(
      generateMinutes().filter((min) => !availableMinutes.has(min))
    );
  }, [hours, selectedDate, type, selectedHour, selectedPeriod]);

  const updateTime = useCallback(
    (hour: string, minute: string, period: string) => {
      if (isOpen) {
        const newTime = `${hour}:${minute} ${period}`;
        onChange(newTime);
      }
    },
    [isOpen, onChange]
  );

  const handleHourSelect = useCallback(
    (hour: string) => {
      if (!disabledHours.includes(hour)) {
        setSelectedHour(hour);
        updateTime(hour, selectedMinute, selectedPeriod);
      }
    },
    [selectedMinute, selectedPeriod, updateTime, disabledHours]
  );

  const handleMinuteSelect = useCallback(
    (minute: string) => {
      if (!disabledMinutes.includes(minute)) {
        setSelectedMinute(minute);
        updateTime(selectedHour, minute, selectedPeriod);
      }
    },
    [selectedHour, selectedPeriod, updateTime, disabledMinutes]
  );

  const handlePeriodSelect = useCallback(
    (period: string) => {
      setSelectedPeriod(period);
      updateTime(selectedHour, selectedMinute, period);
    },
    [selectedHour, selectedMinute, updateTime]
  );

  return (
    <div
      className={`${OutfitFont.className} ${
        !isOpen && "hover:cursor-not-allowed text-neutral-600"
      } flex flex-col items-center w-full`}
    >
      {!top && <hr className="border-b my-4 w-full" />}
      <div className="flex items-center justify-evenly w-full mb-4 gap-px">
        {`${selectedHour}:${selectedMinute} ${selectedPeriod}`}
      </div>
      <div className="relative flex h-[200px] w-fit justify-center rounded-xl shadow-sm border">
        <Wheel
          options={generateHours()}
          selectedValue={selectedHour}
          onSelect={handleHourSelect}
          isOpen={isOpen}
          isHourWheel
          disabledOptions={disabledHours}
        />
        <Wheel
          options={generateMinutes()}
          selectedValue={selectedMinute}
          onSelect={handleMinuteSelect}
          isOpen={isOpen}
          disabledOptions={disabledMinutes}
        />
        <Wheel
          options={["AM", "PM"]}
          selectedValue={selectedPeriod}
          onSelect={handlePeriodSelect}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default TimePicker;

const generateHours = (): string[] => {
  return Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
};

const generateMinutes = (): string[] => {
  return ["00", "15", "30", "45"];
};
