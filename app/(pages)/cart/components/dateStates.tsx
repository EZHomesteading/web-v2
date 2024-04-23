"use client";

import { useState } from "react";
import { Hours } from "@prisma/client";

import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";
import { Value } from "react-datetime-picker/dist/cjs/shared/types";

interface StatusProps {
  hours: Hours;
}

const isOpenNow = (
  todayHours: { open: number; close: number }[] | undefined
): boolean => {
  if (!todayHours) {
    return false;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return todayHours.some(
    (slot) => currentMinutes >= slot.open && currentMinutes <= slot.close
  );
};

const DateState = ({ hours }: StatusProps) => {
  const now = new Date();
  const [selectedDateTime, setSelectedDateTime] = useState(now);
  const [selectedMinutes, setSelectedMinutes] = useState(
    selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes()
  );
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const todayHours = hours[currentDayIndex as keyof Hours];
  const open = isOpenNow(todayHours);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins} ${ampm}`;
  };

  const openHours = formatTime(hours[1][0].open);
  const closeHours = formatTime(hours[1][0].close);

  const handleDateTimeChange = (date: any) => {
    setSelectedDateTime(date);
    setSelectedMinutes(date.getHours() * 60 + date.getMinutes());
  };
  const validPickup = (
    todayHours: { open: number; close: number }[] | undefined
  ): boolean => {
    if (!todayHours) {
      return false;
    }
    if (selectedMinutes < now.getHours() * 60 + now.getMinutes()) {
      return false;
    }
    if (selectedDateTime.getDate() < now.getDate()) {
      return false;
    }
    return todayHours.some(
      (slot) => selectedMinutes >= slot.open && selectedMinutes <= slot.close
    );
  };
  const validTime = validPickup(todayHours);
  const openText = ` this shop is open today from ${openHours} untill ${closeHours}`;

  console.log(selectedDateTime);
  return (
    <>
      <span className={`text-xs ${open ? "text-green-500" : "text-red-500"}`}>
        {open ? "Open" : "Closed"}
      </span>
      <div>
        <span
          className={`text-xs ${validTime ? "text-green-500" : "text-red-500"}`}
        >
          {validTime
            ? "Valid pickup time detected"
            : "invalid pickup time detected"}
        </span>
      </div>
      <p>{openText}</p>
      <DateTimePicker
        className="text-black mt-2 w-5 outline-none"
        onChange={handleDateTimeChange}
        value={selectedDateTime}
        disableClock={true} // Optional, to disable clock selection
        clearIcon={null} // Optional, to remove the clear icon
        calendarIcon={null} // Optional, to remove the calendar icon
      />
    </>
  );
};

export default DateState;
