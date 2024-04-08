"use client";
import CoopHoursSlider from "@/app/components/co-op-hours-slider";
import { useState } from "react";
import axios from "axios";
import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CoOpHoursPage = () => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [coOpHours, setCoOpHours] = useState({
    Monday: { open: 480, close: 1020 },
    Tuesday: { open: 480, close: 1020 },
    Wednesday: { open: 480, close: 1020 },
    Thursday: { open: 480, close: 1020 },
    Friday: { open: 480, close: 1020 },
    Saturday: { open: 480, close: 1020 },
    Sunday: { open: 480, close: 1020 },
  });

  const handleHourChange = (open, close) => {
    setCoOpHours((prevHours) => ({
      ...prevHours,
      [days[currentDayIndex]]: { open, close },
    }));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex + 1) % days.length);
  };

  const handlePrevDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex - 1) % days.length);
  };

  const handleApplyToAll = () => {
    const { open, close } = coOpHours[days[currentDayIndex]];
    setCoOpHours((prevHours) =>
      days.reduce((acc, day) => {
        acc[day] = { open, close };
        return acc;
      }, {})
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/update", {
        hoursOfOperation: coOpHours,
      });
      if (response.status !== 200) {
        throw new Error("error");
      }
      toast.success("Your co-op hours were updated!");
    } catch (error) {
      toast.error("We couldn't update your hours");
    }
  };

  const currentDay = days[currentDayIndex];
  const { open, close } = coOpHours[currentDay];

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-10">
      <CoopHoursSlider
        day={currentDay}
        open={open}
        close={close}
        onChange={handleHourChange}
        onNextDay={handleNextDay}
        onPrevDay={handlePrevDay}
      />
      <button onClick={handleApplyToAll}>Apply to All Days</button>
      <div className="px-2 py-4">
        <Button onClick={handleSubmit} label="Update My Hours" />
      </div>
    </div>
  );
};

export default CoOpHoursPage;
