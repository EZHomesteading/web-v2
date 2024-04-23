"use client";
import CoopHoursSlider from "@/app/(pages)/co-op-hours/co-op-hours-slider";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { HoursDisplay } from "./hours-display";
import Button from "@/app/components/Button";
import { DaySelect } from "./day-select";
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
  const user = useCurrentUser();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  // const formatTime = (minutes) => {
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   const ampm = hours >= 12 ? "PM" : "AM";
  //   const formattedHours = hours % 12 || 12;
  //   const formattedMins = mins < 10 ? `0${mins}` : mins;
  //   return `${formattedHours}:${formattedMins} ${ampm}`;
  // };
  const defaultHours = {
    0: { open: 480, close: 1020 },
    1: { open: 480, close: 1020 },
    2: { open: 480, close: 1020 },
    3: { open: 480, close: 1020 },
    4: { open: 480, close: 1020 },
    5: { open: 480, close: 1020 },
    6: { open: 480, close: 1020 },
  };

  const [coOpHours, setCoOpHours] = useState(defaultHours);

  const handleHourChange = (open, close) => {
    setCoOpHours((prevHours) => ({
      ...prevHours,
      [currentDayIndex]: { open, close },
    }));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex + 1) % days.length);
  };

  const handlePrevDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex - 1) % days.length);
  };

  const handleApplyToAll = () => {
    const currentTimes = coOpHours[currentDayIndex];
    setCoOpHours((prevHours) =>
      Object.keys(prevHours).reduce((acc, day) => {
        acc[day] = { ...currentTimes };
        return acc;
      }, {})
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/update", {
        hours: coOpHours,
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
  const { open, close } = coOpHours[currentDayIndex];

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
      {/* <div className="px-2 py-4">
        <Button onClick={handleSubmit} label="Update My Hours" />
      </div> */}
      {/* <DaySelect /> */}
      <HoursDisplay coOpHours={coOpHours} />
    </div>
  );
};

export default CoOpHoursPage;
