"use client";

import {
  SheetCartC,
  SheetCloseC,
  SheetContentC,
} from "@/app/components/ui/sheet-cart";
import { Sheet, SheetTrigger } from "@/app/components/ui/sheet";
import { useEffect, useState } from "react";
import { Hours } from "@prisma/client";
import { CartGroup } from "@/next-auth";
import EarliestPickup from "./earliest-pickup";
import CustomTime from "./custom-time";
import "react-datetime-picker/dist/DateTimePicker.css";
import { set } from "lodash";
import axios from "axios";

interface StatusProps {
  hours: Hours;
  onSetTime: any;
  index: number;
  cartGroup: CartGroup | null;
}

const DateState = ({ hours, cartGroup, onSetTime, index }: StatusProps) => {
  const now = new Date();
  const [date, setDate] = useState<Date | undefined>(now);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(now);
  const [selectedTime, setSelectedTime] = useState<any>();
  const [options, setOptions] = useState<string[]>([]);
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null);

  const [earliestPickupTime, setEarliestPickupTime] = useState<string | null>(
    null
  );
  const [hasClickedEarliestPickup, setHasClickedEarliestPickup] =
    useState<boolean>(false);
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins} ${ampm}`;
  };
  useEffect(() => {
    calculateEarliestPickupTime();
  }, []);
  const roundNumber = (n: number) => {
    if (n > 0) return Math.ceil(n / 30) * 30;
    else if (n < 0) return Math.floor(n / 30) * 30;
    else return 30;
  };

  const buildArray = async () => {
    if (date === undefined) {
      return;
    }
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const newHoursIndex = (date.getDay() + 6) % 7;
    const newHours = hours[newHoursIndex as keyof Hours];
    const resultantArray = [];
    const roundedMin = roundNumber(currentMin);
    if (date.getDate() < now.getDate()) {
      return;
    }
    if (date.getDate() === now.getDate() && currentMin > newHours[0].open) {
      for (let i = roundedMin; i <= newHours[0].close; i += 30) {
        const time = formatTime(i);
        resultantArray.push(time);
      }
      setOptions(resultantArray);
      return;
    }
    for (let i = newHours[0].open; i <= newHours[0].close; i += 30) {
      const time = formatTime(i);
      resultantArray.push(time);
    }
    setOptions(resultantArray);
  };

  useEffect(() => {
    setOptions([]);
    buildArray();
  }, [date]);

  function insertTimeIntoDatetime(datetime: Date, timeString: string) {
    const inputDatetime = new Date(datetime);

    const matchResult = timeString.match(/(\d+):(\d+)\s*(\w*)/i);
    if (!matchResult) {
      console.error("Invalid time string format:", timeString);
      return inputDatetime;
    }
    const [hours, minutes, meridiem] = matchResult;
    let parsedHours = parseInt(hours, 10);
    if (meridiem) {
      const isPM = meridiem.toUpperCase() === "PM";
      if (isPM && parsedHours < 12) {
        parsedHours += 12;
      } else if (!isPM && parsedHours === 12) {
        parsedHours = 0;
      }
    } else {
      parsedHours = parsedHours % 24;
    }
    const parsedMinutes = parseInt(minutes, 10);
    inputDatetime.setHours(parsedHours, parsedMinutes, 0, 0);
    return inputDatetime;
  }
  const setTime = (option: string) => {
    if (date && option) {
      setSelectedTime({
        pickupTime: insertTimeIntoDatetime(date, option),
        index: index,
      });
    }
  };
  useEffect(() => {
    onSetTime(selectedTime);
  }),
    [selectedTime];

  const calculateEarliestPickupTime = () => {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    let nextAvailableTime = null;
    console.log("user time in minutes:", currentMin);
    for (let i = 0; i < 7; i++) {
      const newHoursIndex = ((now.getDay() + i) % 7) - 1;
      console.log("index", newHoursIndex);
      const newHours = hours[newHoursIndex as keyof Hours];

      if (newHours.length === 0) continue;

      const openTime = newHours[0].open; // time the co-op opens on the day
      const closeTime = newHours[0].close; // time the co-op closes on the day
      console.log("open time for co-op", openTime);
      console.log("closing time for co-op", closeTime);

      if (i === 0 && currentMin < closeTime) {
        // if the user is trying to buy today and before the co-op is closed, proceed
        if (currentMin < openTime) {
          // if the user is trying to buy today and before the co-op is open, pick up is when the co-op opens plus 30 minutes
          // we will need another check here that if the time difference between co-op open time and order time is less than the co-ops set out time, the pick up time is the order time plus set out time
          console.log("entered case 1");
          nextAvailableTime = new Date(now);
          nextAvailableTime.setHours(
            Math.floor(openTime / 60),
            openTime % 60,
            0,
            0
          );
          nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + 30);
        } else {
          // if the user is buying today after the co-op has opened but before they close, the pick up is now plus the set out time
          console.log("entered case 2");
          nextAvailableTime = new Date(now);
          nextAvailableTime.setMinutes(now.getMinutes() + 30);
        }
        break;
      } else if (i > 0) {
        console.log("entered case 3");
        nextAvailableTime = new Date(now);
        nextAvailableTime.setDate(now.getDate() + i);
        nextAvailableTime.setHours(
          Math.floor(openTime / 60),
          openTime % 60,
          0,
          0
        );
        nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + 30);
        break;
      }
    }
    if (nextAvailableTime) {
      const formattedEarliestTime = formatPickupTime({
        pickupTime: nextAvailableTime,
      });
      setEarliestPickupTime(formattedEarliestTime);
    }

    return nextAvailableTime;
  };
  useEffect(() => {
    const nextAvailableTime = calculateEarliestPickupTime();
    setNextAvailableTime(nextAvailableTime);
  }, []);
  const handleAsSoonAsPossible = () => {
    if (nextAvailableTime) {
      setSelectedTime({
        pickupTime: nextAvailableTime,
        index: index,
      });
    }
  };

  const formatPickupTime = (selectedTime: any) => {
    if (!selectedTime) return "";

    const { pickupTime } = selectedTime;
    const now = new Date();
    const pickupDate = new Date(pickupTime);

    if (pickupDate.toDateString() === now.toDateString()) {
      return `Today at ${pickupDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (pickupDate.getTime() < now.getTime() + 7 * 24 * 60 * 60 * 1000) {
      return `${pickupDate.toLocaleDateString([], {
        weekday: "long",
      })} at ${pickupDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else {
      return `${pickupDate.toLocaleDateString()} at ${pickupDate.toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;
    }
  };

  return (
    <SheetCartC>
      <SheetTrigger className="border-[1px] px-2 py-2 rounded-lg shadow-lg">
        {selectedTime?.pickupTime ? (
          <>{formatPickupTime(selectedTime)}</>
        ) : (
          "Set Pickup Time"
        )}
      </SheetTrigger>
      <SheetContentC
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        handleAsSoonAsPossible={handleAsSoonAsPossible}
        earliestPickupTime={earliestPickupTime}
      >
        <Sheet>
          <CustomTime
            hours={hours}
            options={options}
            setTime={setTime}
            date={date}
            setDate={setDate}
            cartGroup={cartGroup}
            now={now}
          />
        </Sheet>
      </SheetContentC>
    </SheetCartC>
  );
};

export default DateState;
