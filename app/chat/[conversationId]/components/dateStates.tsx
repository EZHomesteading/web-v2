"use client";
//parent element for date picker and handling of datepicker related data to be sent to the chat parent element.
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
import { ValidTime } from "@/app/(pages)/listings/[listingId]/components/CustomTimeModal2";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  hours: ExtendedHours;
  onSetTime: (childTime: ValidTime) => void;
  isSeller: boolean;
}

const CustomTimeModal2: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  hours,
  isSeller,
  onSetTime,
}) => {
  const now = new Date();
  const [date, setDate] = useState<Date | undefined>(now); //current time
  const [options, setOptions] = useState<string[]>([]); // array of times with 30 minute intervals

  // formats time from date type to date string readable by our other formatters.
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
    const matchResult = timeString.match(/(\d+):(\d+)\s*(\w*)/i);

    // If the time string is invalid, log an error and return the input datetime
    if (!matchResult) {
      console.error("Invalid time string format:", timeString);
      return inputDatetime;
    }

    //destructuring match result object, time is unused, but is necessary to pass to function properly.
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
      <div className="p-6 rounded-lg max-w-3xl mx-auto">
        <div className="flex flex-col  justify-between items-start md:items-center space-y-6  md:space-x-6">
          {isSeller ? (
            <div className="w-full ">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  These are not your open hours. Feel free to set whatever time
                  you are able to set this item out.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-auto">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">
                  Co-op Hours Each Day
                </h3>
                <HoursDisplay coOpHours={hours} />
              </div>
            </div>
          )}

          <div className="flex flex-col w-full space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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
            <ScrollArea className="h-64 w-full rounded-md border bg-white border-gray-200">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium">Open Hours</h4>
                {!options.length ? (
                  <p className="text-gray-500">
                    No available times on this day
                  </p>
                ) : (
                  options.map((option) => (
                    <div key={option} className="group">
                      <div
                        className="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200 ease-in-out group-hover:bg-gray-100"
                        onClick={() => {
                          setTime(option);
                          onClose();
                        }}
                      >
                        <p className="text-sm">{option}</p>
                      </div>
                      <Separator className="my-1" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomTimeModal2;
