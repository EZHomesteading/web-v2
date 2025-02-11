import { useState, useEffect, useCallback } from "react";
import Wheel from "./wheel";
import { OutfitFont } from "@/components/fonts";

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

  useEffect(() => {
    if (isOpen) {
      const [time, period] = value.split(" ");
      const [hour, minute] = time.split(":");
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    } else {
      setSelectedHour("12");
      setSelectedMinute("00");
      setSelectedPeriod("AM");
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

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isOpen) {
      const newValue = e.target.value;
      onChange(newValue);
      const [time, period] = newValue.split(" ");
      const [hour, minute] = time.split(":");

      if (hour && minute && period) {
        setSelectedHour(hour.padStart(2, "0"));
        setSelectedMinute(minute.padStart(2, "0"));
        setSelectedPeriod(period.toUpperCase());
      }
    }
  };

  return (
    <div
      className={`${OutfitFont.className} ${
        !isOpen && "hover:cursor-not-allowed text-neutral-600"
      } flex flex-col items-center w-full`}
    >
      {!top && <hr className="border-b my-4 w-full" />}
      <div className="flex items-center justify-evenly w-full mb-4 gap-px">
        <div>
          <div className="text-2xl pt-2">{top ? "Open" : "Close"}</div>
        </div>
        <input
          className={`text-xl font-medium text-center border border-gray-300 bg-inherit focus:outline-none w-fit rounded-md shadow-md px-2 py-4`}
          value={isOpen ? value : "Closed"}
          onChange={handleTimeInputChange}
          size={8}
          disabled={!isOpen}
        />
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
