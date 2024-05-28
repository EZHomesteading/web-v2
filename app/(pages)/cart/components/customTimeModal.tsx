"use client";

import React, { useState, useEffect } from "react";

import Modal from "@/app/components/modals/chatmodals/Modal";

import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/app/components/ui/calendar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  hours: ExtendedHours;
  index: number;
  cartGroup: CartGroup | null;
  onSetTime: any;
}

const CustomTimeModal: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  hours,
  index,
  cartGroup,
  onSetTime,
}) => {
  const now = new Date();
  // useState hooks to manage the state of the date and options
  const [date, setDate] = useState<Date | undefined>(now); // current time
  const [options, setOptions] = useState<string[]>([]); // array of times with 15 minute intervals

  // Function to format minutes to a readable time string (e.g., 1:30 PM)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins} ${ampm}`;
  };

  // Function to round minutes to the nearest 30 minutes interval
  const roundNumber = (n: number) => {
    if (n > 0) return Math.ceil(n / 30) * 30;
    else if (n < 0) return Math.floor(n / 30) * 30;
    else return 30;
  };

  // Function to build an array of available time options
  const buildArray = async () => {
    // Early return if date is undefined
    if (date === undefined) {
      return;
    }

    const currentMin = now.getHours() * 60 + now.getMinutes();
    const newHoursIndex = (date.getDay() + 6) % 7;
    const newHours = hours[newHoursIndex as keyof ExtendedHours];

    // Early return if co-op is closed or hours are undefined
    if (newHours === null || newHours === undefined) {
      return;
    }

    const resultantArray = [];
    const roundedMin = roundNumber(currentMin);

    // Early return if the selected date is before the current date
    if (date.getDate() < now.getDate()) {
      return;
    }

    // If the selected date is today and the current time is past the opening time
    if (date.getDate() === now.getDate() && currentMin > newHours[0].open) {
      // Add time options from the current rounded time to the closing time
      for (let i = roundedMin; i <= newHours[0].close; i += 30) {
        const time = formatTime(i);
        resultantArray.push(time);
      }
      setOptions(resultantArray);
      return;
    }

    // Add time options from the opening time to the closing time
    for (let i = newHours[0].open; i <= newHours[0].close; i += 30) {
      const time = formatTime(i);
      resultantArray.push(time);
    }
    setOptions(resultantArray);
  };

  // useEffect hook to rebuild the options array whenever the date changes
  useEffect(() => {
    setOptions([]);
    buildArray();
  }, [date]);

  // Function to insert a time string into a datetime object
  function insertTimeIntoDatetime(datetime: Date, timeString: string) {
    const inputDatetime = new Date(datetime);
    const matchResult = timeString.match(/(\\d+):(\\d+)\\s*(\\w*)/i);

    // If the time string is invalid, log an error and return the input datetime
    if (!matchResult) {
      console.error("Invalid time string format:", timeString);
      return inputDatetime;
    }

    const [time, hours, minutes, meridiem] = matchResult;
    let parsedHours = parseInt(hours, 10);

    // Handle AM/PM format
    if (meridiem) {
      const isPM = meridiem.toUpperCase() === "PM";
      if (isPM && parsedHours < 12) {
        parsedHours += 12;
      } else if (!isPM && parsedHours === 12) {
        parsedHours = 0;
      }
    } else {
      parsedHours = parsedHours % 24; // Handle 24-hour format
    }

    const parsedMinutes = parseInt(minutes, 10);
    inputDatetime.setHours(parsedHours, parsedMinutes, 0, 0);
    return inputDatetime;
  }

  // Function to set the selected time option
  const setTime = (option: string) => {
    if (date && option) {
      onSetTime({
        pickupTime: insertTimeIntoDatetime(date, option),
        index: index,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-center items-center   ">
          <div className="w-fit border-none shadow-none">
            <div className="grid gap-4">
              <div className="bg-white">
                <div className="px-1 py-[.35rem] rounded-lg border-gray-200 border-[1px]">
                  Co-op Hours Each Day
                </div>
                <div className="mt-1">
                  <HoursDisplay coOpHours={hours} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-fit">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-fit sm:w-fit justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  fromMonth={now}
                  disabled={{ before: now, after: cartGroup?.expiry }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <ScrollArea className="h-[16.1rem] w-full rounded-md border mt-1">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">
                  Open Hours
                </h4>
                {!options.length ? (
                  <div>No available times on this day</div>
                ) : null}

                {options.map((option) => (
                  <div key={option} className="hover:bg-slate">
                    <div onClick={onClose}>
                      <div
                        className="text-sm cursor-pointer hover:bg-slate-400"
                        onClick={() => {
                          setTime(option);
                          onClose;
                        }}
                      >
                        {option}
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomTimeModal;
