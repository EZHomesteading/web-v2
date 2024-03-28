"use client";
import HourPicker from "./co-op-hour-select";
import { CoOpHours, initialCoOpHours } from "./co-op-hours";
import { useState } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";

const CoOpHoursPage = () => {
  const [coOpHours, setCoOpHours] = useState<CoOpHours[]>(initialCoOpHours);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHourChange = (
    day: string,
    field: "open" | "close",
    dbValue: string
  ) => {
    setCoOpHours((prevHours) =>
      prevHours.map((hours) => {
        if (hours.day === day) {
          return { ...hours, [field]: dbValue };
        }
        return hours;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hoursOfOperation = coOpHours.reduce((acc, hours) => {
        acc[hours.day] = [{ start: hours.open, end: hours.close }];
        return acc;
      }, {} as { [key: string]: { start: string; end: string }[] });

      const response = await axios.post("/api/update", {
        hoursOfOperation,
      });

      if (response.status !== 200) {
        throw new Error("error");
      }

      toast.success("Your co-op hours were updated!");
    } catch (error) {
      toast.error("We couldn't update your hours");
    } finally {
      setLoading(false);
    }
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
                onChange={(dbValue) =>
                  handleHourChange(hours.day, "open", dbValue)
                }
              />
              <HourPicker
                sideLabel=""
                buttonLabel="Close"
                value={hours.close}
                onChange={(dbValue) =>
                  handleHourChange(hours.day, "close", dbValue)
                }
              />
            </div>
          ))}
          <Button onClick={handleSubmit} label="Update My Hours" />
        </div>
      </div>
    </>
  );
};

export default CoOpHoursPage;
