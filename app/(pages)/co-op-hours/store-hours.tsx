"use client";
import CoopHoursSlider from "@/app/(pages)/co-op-hours/co-op-hours-slider";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { HoursDisplay } from "./hours-display";
import Button from "@/app/components/Button";
import { DaySelect } from "./day-select";
import { UserInfo } from "@/next-auth";

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
  user: UserInfo;
}

interface HoursType {
  [key: number]: {
    open: number;
    close: number;
  };
}
const CoOpHoursPage = ({ user }: Props) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const defaultHours: HoursType = {
    0: { open: 480, close: 1020 },
    1: { open: 480, close: 1020 },
    2: { open: 480, close: 1020 },
    3: { open: 480, close: 1020 },
    4: { open: 480, close: 1020 },
    5: { open: 480, close: 1020 },
    6: { open: 480, close: 1020 },
  };

  const [coOpHours, setCoOpHours] = useState(defaultHours);

  const handleHourChange = (open: any, close: any) => {
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
      Object.keys(prevHours).reduce((acc, day: string) => {
        acc[Number(day)] = { ...currentTimes };
        return acc;
      }, {} as HoursType)
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
