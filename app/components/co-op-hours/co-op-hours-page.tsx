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
import { UserRole } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";

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
  const [SODT, setSODT] = useState<any>();
  return (
    <>
      <Card className="flex flex-col bg-inherit border-none shadow-xl md:mt-20 lg:w-2/3 w-5/6">
        <div className="flex flex-col">
          <CardHeader className={`${outfit.className} text-4xl`}>
            {user?.role == UserRole.COOP ? (
              <ul className={`${outfit.className}`}>
                <li className="text-4xl">Set Your Hours</li>
                <li className="text-sm">
                  Control when people drop off and pickup from your store
                </li>
              </ul>
            ) : (
              <ul className={`${outfit.className}`}>
                <li className="text-4xl">Set Delivery Hours</li>
                <li className="text-sm">
                  Control when co-ops request a drop off time
                </li>
              </ul>
            )}
          </CardHeader>
          <CardContent className=" w-full p-4">
            <CoopHoursSlider
              day={currentDay}
              hours={currentDayHours}
              onChange={handleHourChange}
              onNextDay={handleNextDay}
              onPrevDay={handlePrevDay}
            />
            <CardFooter className="flex flex-col items-center justify-between gap-x-6 gap-y-2 mt-12 mb-0 p-0">
              <Sheet>
                <div
                  onClick={handleClose}
                  className={`${outfit.className} bg-red-300 p-3  lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg text-center hover:cursor-pointer`}
                >
                  Close on {currentDay}
                </div>
                <SheetTrigger
                  onClick={handleApplyToAll}
                  className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg`}
                >
                  Apply This Schedule To Other Days
                </SheetTrigger>
                <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                  <DaySelect />
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger
                  className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg`}
                >
                  Visualize Your Current Schedule
                </SheetTrigger>
                <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                  <HoursDisplay coOpHours={coOpHours} />
                </SheetContent>
              </Sheet>
            </CardFooter>
          </CardContent>
        </div>
      </Card>
      <Card className="flex flex-col bg-inherit border-none shadow-xl md:mt-20 lg:w-2/3 w-5/6 pt-5">
        <CardContent className={`${outfit.className} `}>
          {user?.role === UserRole.COOP ? (
            <h2 className="text-4xl">Set Out Time</h2>
          ) : (
            <h2 className="text-4xl">Time to Begin Delivery</h2>
          )}
          <ul>
            {user?.role === UserRole.COOP ? (
              <li>
                This is the amount of time it takes between you{" "}
                <em>agreeing </em> to a pick up time and preparing the order.
              </li>
            ) : (
              <li>
                This is the amount of time it takes between you{" "}
                <em>agreeing to delivery time</em> and preparing it for
                delivery.
              </li>
            )}
            <li>
              This is important to understand.{" "}
              <Link href="/info/sodt" className="text-blue-500">
                More Info
              </Link>
            </li>
          </ul>
          <div className="justify-end flex">
            <label
              htmlFor="sodt"
              className="block text-sm font-medium leading-6"
            ></label>

            <Select
              onValueChange={(value) => setSODT(parseInt(value, 10))}
              // value={SODT.toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={user?.SODT || "Select a Time"} />
              </SelectTrigger>
              <SelectContent className={`${outfit.className} sheet`}>
                <SelectGroup>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="45">45 Minutes</SelectItem>
                  <SelectItem value="60">1 Hour</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CoOpHoursPage;
