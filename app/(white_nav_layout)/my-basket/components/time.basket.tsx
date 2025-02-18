import { useState, useEffect, useCallback } from "react";
import { OutfitFont } from "@/components/fonts";
import Wheel from "../../../(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/wheel";
import { DeliveryPickupToggleMode } from "./helper-components-calendar";
interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  mode?: DeliveryPickupToggleMode;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, mode }) => {
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");

  useEffect(() => {
    const [time, period] = value.split(" ");
    if (time && period) {
      const [hour, minute] = time.split(":");
      if (hour && minute) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(period);
      }
    }
  }, [value]);

  const updateTime = useCallback(
    (hour: string, minute: string, period: string) => {
      const newTime = `${hour}:${minute} ${period}`;
      onChange(newTime);
    },
    [onChange]
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
    const newValue = e.target.value;
    onChange(newValue);
    const [time, period] = newValue.split(" ");
    const [hour, minute] = time.split(":");

    if (hour && minute && period) {
      setSelectedHour(hour.padStart(2, "0"));
      setSelectedMinute(minute.padStart(2, "0"));
      setSelectedPeriod(period.toUpperCase());
    }
  };
  return (
    <div
      className={`${OutfitFont.className} 
        
       flex flex-col items-center w-full`}
    >
      <div className={`flex w-full px-3 pb-2 justify-evenly items-center`}>
        <div className={`text-lg font-semibold w-fit`}>
          {mode === DeliveryPickupToggleMode.PICKUP
            ? "Pickup Time"
            : "Delivery Time"}
        </div>
        <input
          className={`text-sm font-normal text-center border border-gray-300 bg-inherit focus:outline-none w-fit rounded-md shadow-md p-2`}
          value={value}
          onChange={handleTimeInputChange}
          size={8}
          disabled={false}
        />
      </div>
      <div className="relative flex h-[200px] w-fit justify-center rounded-xl shadow-sm border">
        <Wheel
          options={generateHours()}
          selectedValue={selectedHour}
          onSelect={handleHourSelect}
          isOpen={true}
          isHourWheel
        />
        <Wheel
          options={generateMinutes()}
          selectedValue={selectedMinute}
          onSelect={handleMinuteSelect}
          isOpen={true}
        />
        <Wheel
          options={["AM", "PM"]}
          selectedValue={selectedPeriod}
          onSelect={handlePeriodSelect}
          isOpen={true}
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
