"use client";
import HourPicker from "./co-op-hour-select";
import { CoOpHours, initialCoOpHours } from "./co-op-hours";
import { useState } from "react";

const CoOpHoursPage = () => {
  const [coOpHours, setCoOpHours] = useState<CoOpHours[]>(initialCoOpHours);

  const handleHourChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    setCoOpHours((prevHours) =>
      prevHours.map((hours) => {
        if (hours.day === day) {
          return { ...hours, [field]: value };
        }
        return hours;
      })
    );
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 mt-10">
        <div className="space-y-4">
          {coOpHours.map((hours) => (
            <div key={hours.day} className="flex flex-col items-end space-y-1">
              <HourPicker
                sideLabel={`${hours.day}`}
                buttonLabel="Open"
                value={hours.open}
                onChange={(value) => handleHourChange(hours.day, "open", value)}
              />
              <HourPicker
                sideLabel=""
                buttonLabel="Close"
                value={hours.close}
                onChange={(value) =>
                  handleHourChange(hours.day, "close", value)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CoOpHoursPage;
