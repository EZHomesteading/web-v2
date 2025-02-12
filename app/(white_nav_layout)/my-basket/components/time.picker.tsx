import { useState, useEffect, useCallback } from "react";
import { OutfitFont } from "@/components/fonts";
import Wheel from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/wheel";

interface TimePickerProps {
  top?: boolean;
  value: string;
  onChange: (time: string) => void;
  isOpen: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  top = true,
  value,
  onChange,
  isOpen,
}) => {
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");

  // Clean and normalize the incoming time string
  const parseTimeString = (timeStr: string) => {
    // Remove any existing AM/PM and split time
    const cleanTime = timeStr.replace(/AM|PM/g, "").trim();
    const [hours, minutes] = cleanTime.split(":").map((part) => part.trim());

    const hour = parseInt(hours, 10);
    let period = "AM";
    let adjustedHour = hour;

    if (hour >= 12) {
      period = "PM";
      if (hour > 12) {
        adjustedHour = hour - 12;
      }
    } else if (hour === 0) {
      adjustedHour = 12;
    }

    return {
      hour: adjustedHour.toString().padStart(2, "0"),
      minute: minutes.padStart(2, "0"),
      period,
    };
  };

  useEffect(() => {
    if (isOpen && value) {
      const { hour, minute, period } = parseTimeString(value);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    }
  }, [value, isOpen]);

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
      setSelectedHour(hour);
      updateTime(hour, selectedMinute, selectedPeriod);
    },
    [selectedMinute, selectedPeriod, updateTime]
  );

  const handleMinuteSelect = useCallback(
    (minute: string) => {
      setSelectedMinute(minute);
      updateTime(selectedHour, minute, selectedPeriod);
    },
    [selectedHour, selectedPeriod, updateTime]
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
        />
        <Wheel
          options={generateMinutes()}
          selectedValue={selectedMinute}
          onSelect={handleMinuteSelect}
          isOpen={isOpen}
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
