"use client";
//custom time input modal for buy now page, modified from one in cart.
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
import { ExtendedHours } from "@/next-auth";
import { Outfit, Zilla_Slab } from "next/font/google";
import { IoStorefrontOutline } from "react-icons/io5";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const zilla = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});
interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  hours: ExtendedHours;
  onSetTime: any;
  user: any;
}

const CustomTimeModal2: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  hours,
  user,
  onSetTime,
}) => {
  const now = new Date();
  const [date, setDate] = useState<Date | undefined>(now); //current time
  const [options, setOptions] = useState<string[]>([]); // array of times with 15 minute intervals
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false); // Close the popover
  };
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
    if (date === undefined || hours === null) {
      return;
    }
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const newHoursIndex = (date.getDay() + 6) % 7;
    const newHours = hours[newHoursIndex as keyof ExtendedHours];
    if (newHours === null || newHours === undefined || newHours.length === 0) {
      return; //early return if co-op is closed, hours are undefined, or hours array is empty
    }
    const resultantArray = [];
    const roundedMin = roundNumber(currentMin);
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

    // If the time string is invalid, log an error and return the input datetime
    const matchResult = timeString.match(/(\d+):(\d+)\s*(\w*)/i);
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
  // Function to set the selected time option, and send it to the parent element
  const setTime = (option: string) => {
    if (date && option) {
      onSetTime({
        pickupTime: insertTimeIntoDatetime(date, option),
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className={`${outfit.className} font-semibold text-xl mb-1`}>
        Pick a Date & Time
      </h1>
      <div>
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild className="flex justify-start">
              <Button
                variant={"outline"}
                className={`${zilla.className} bg-neutral-100 shadow-md mb-1`}
              >
                <IoStorefrontOutline className="mr-2 h-4 w-4" />
                <span>View Hours</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`${outfit.className} border-neutral-400 border-[1px] rounded-lg shadow-md bg-neutral-100`}
            >
              <HoursDisplay coOpHours={hours} />
            </PopoverContent>
          </Popover>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild className="flex justify-start">
              <Button
                variant={"outline"}
                className={`${zilla.className} bg-neutral-100 shadow-md mb-2`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`${outfit.className} border-neutral-400 border-[1px] rounded-lg shadow-md bg-neutral-100`}
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                fromMonth={now}
                disabled={{ before: now }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {date && (
          <ScrollArea className="border-neutral-400 border-[1px] rounded-lg shadow-md">
            <div className="p-4">
              {(() => {
                if (!date) {
                  return null;
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(date);
                selectedDate.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                  return (
                    <div className={`${zilla.className} text-sm`}>
                      Date has passed
                    </div>
                  );
                } else if (!options.length) {
                  return (
                    <div className={`${zilla.className} text-sm`}>
                      Closed on {format(date, "EEEE")}
                    </div>
                  );
                } else {
                  return (
                    <h4
                      className={`${outfit.className} mb-4 text- font-medium leading-none`}
                    >
                      Select a Time
                    </h4>
                  );
                }
              })()}

              {options.map((option) => (
                <div key={option} className="hover:bg-slate">
                  <div onClick={onClose}>
                    <div
                      className={`${zilla.className} text-sm cursor-pointer hover:bg-green-200 rounded-md p-[.25rem]`}
                      onClick={() => {
                        setTime(option);
                        onClose;
                      }}
                    >
                      {option}
                    </div>
                  </div>
                  <Separator className="my-[3px]" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </Modal>
  );
};

export default CustomTimeModal2;
