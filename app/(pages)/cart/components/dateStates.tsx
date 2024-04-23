"use client";

import { useState } from "react";

import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";

const DateState = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(
    new Date("2023-04-16T12:00:00")
  );

  const handleDateTimeChange = (date: any) => {
    setSelectedDateTime(date);
  };

  return (
    <>
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
