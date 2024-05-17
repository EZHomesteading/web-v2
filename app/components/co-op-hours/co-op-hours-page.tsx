"use client";
import CoopHoursSlider from "./co-op-hours-slider";
import { useState } from "react";
import { HoursDisplay } from "./hours-display";
import { DaySelect } from "./day-select";
import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import { ExtendedHours } from "@/next-auth";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const outfit = Outfit({ subsets: ["latin"] });

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
    setCurrentDayIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % days.length;
      const nextDayHours = coOpHours[nextIndex]?.[0];

      if (nextDayHours === null) {
        setCoOpHours((prevHours) => ({
          ...prevHours,
          [nextIndex]: [defaultHours],
        }));
      } else {
        setCoOpHours((prevHours) => ({
          ...prevHours,
          [nextIndex]: null,
        }));
      }

      return nextIndex;
    });
  };

  const handlePrevDay = () => {
    if (currentDayIndex == 0) {
      setCurrentDayIndex(6);
    } else {
      setCurrentDayIndex((prevIndex) => (prevIndex - 1) % days.length);
    }
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

  const handleClose = () => {
    setCoOpHours((prevHours) => ({
      ...prevHours,
      [currentDayIndex]: null,
    }));
    handleNextDay();
  };
  const currentDay = days[currentDayIndex];
  const defaultHours = {
    open: 480,
    close: 1020,
  };
  const currentDayHours = coOpHours[currentDayIndex]?.[0] || defaultHours;

  return (
    <Card className="flex flex-col lg:flex-row justify-center items-center bg-inherit border-none md:shadow-xl h-fit">
      <div className="flex flex-col">
        <CardContent>
          <div className="flex justify-end">
            <Button onClick={handleClose} className="bg-red-900 text-[.75rem]">
              Close on {currentDay}
            </Button>
          </div>
          <CoopHoursSlider
            day={currentDay}
            hours={currentDayHours}
            onChange={handleHourChange}
            onNextDay={handleNextDay}
            onPrevDay={handlePrevDay}
          />
          <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-x-6 gap-y-2 mt-12 mb-0 p-0">
            <Sheet>
              <SheetTrigger>
                <Button className="mb-0 text-xs" onClick={handleApplyToAll}>
                  Apply This Schedule To
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                <DaySelect />
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger>
                <Button className="text-xs w-full lg:w-fit">
                  Visualize Your Current Schedule
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                <HoursDisplay coOpHours={coOpHours} />
              </SheetContent>
            </Sheet>
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
};

export default CoOpHoursPage;
