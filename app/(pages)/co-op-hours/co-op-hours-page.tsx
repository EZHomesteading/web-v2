"use client";
import CoopHoursSlider from "@/app/(pages)/co-op-hours/co-op-hours-slider";
import { useState } from "react";
import { HoursDisplay } from "./hours-display";
import { DaySelect } from "./day-select";
import { UserInfo } from "@/next-auth";
import { Hours } from "@prisma/client";

interface ExtendedHours extends Hours {
  [key: number]: { open: number; close: number }[];
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface Props {
  coOpHours: ExtendedHours;
  setCoOpHours: React.Dispatch<React.SetStateAction<ExtendedHours>>;
  user: UserInfo;
}

const CoOpHoursPage = ({ coOpHours, setCoOpHours, user }: Props) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex + 1) % days.length);
  };

  const handlePrevDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex - 1) % days.length);
  };

  const handleHourChange = (open: number, close: number) => {
    setCoOpHours((prevHours) => ({
      ...prevHours,
      [currentDayIndex]: [{ open, close }],
    }));
  };

  const handleApplyToAll = () => {
    const currentTimes = coOpHours[currentDayIndex];
    setCoOpHours((prevHours) => {
      const updatedHours: ExtendedHours = { ...prevHours };
      Object.keys(updatedHours).forEach((day) => {
        updatedHours[Number(day)] = currentTimes;
      });
      return updatedHours;
    });
  };

  const handleSpecificDays = () => {
    const currentTimes = coOpHours[currentDayIndex];
  };

  const currentDay = days[currentDayIndex];
  const { open, close } = coOpHours[currentDayIndex][0];

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <div className="flex flex-col">
        <CoopHoursSlider
          day={currentDay}
          open={open}
          close={close}
          onChange={handleHourChange}
          onNextDay={handleNextDay}
          onPrevDay={handlePrevDay}
        />
        <button onClick={handleApplyToAll}>Apply to All Days</button>
      </div>
      <DaySelect />
      <HoursDisplay coOpHours={coOpHours} />
    </div>
  );
};

export default CoOpHoursPage;
