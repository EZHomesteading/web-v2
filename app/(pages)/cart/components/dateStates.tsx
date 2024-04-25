"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/app/components/ui/sheet";
import { useEffect, useState } from "react";
import { Hours } from "@prisma/client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/app/components/ui/calendar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";

import "react-datetime-picker/dist/DateTimePicker.css";

import { Button } from "@/app/components/ui/button";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { HoursDisplay } from "../../co-op-hours/hours-display";
import { CartGroup } from "@/next-auth";

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
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins} ${ampm}`;
  };

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

  const handleAsSoonAsPossible = () => {
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
    console.log(nextAvailableTime);
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
    <div className="relative">
      <Sheet>
        <SheetTrigger className="border-black border-[1px] px-2 py-2 rounded-lg shadow-lg">
          {selectedTime ? (
            <>{formatPickupTime(selectedTime)}</>
          ) : (
            <>Set Pickup Time</>
          )}
        </SheetTrigger>
        <SheetContent
          side="top"
          className="rounded-lg px-2 py-2 h-screen sm:h-fit sm:w-fit  w-[400px]"
        >
          <Sheet>
            <div className="">
              <Button className="mr-2" onClick={handleAsSoonAsPossible}>
                As soon as possible
              </Button>
              <SheetTrigger>
                <Button>Custom Time</Button>
              </SheetTrigger>
            </div>
            <SheetContent
              side="top"
              className="flex flex-col md:flex-row items-center sm:items-start justify-center h-screen sm:h-fit"
            >
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
              <div className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] sm:w-[280px] justify-start text-left font-normal",
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
                      <div className="hover:bg-slate">
                        <div
                          key={option}
                          className="text-sm cursor-pointer hover:bg-slate-400"
                          onClick={() => setTime(option)}
                        >
                          {option}
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DateState;
//   const currentDayIndex = (new Date().getDay() + 6) % 7; //updaters
//   const todayHours = hours[currentDayIndex as keyof Hours];
//   const validPickup = (
//     todayHours: { open: number; close: number }[] | undefined
//   ): boolean => {
//     if (!todayHours) {
//       return false;
//     }
//     if (selectedMinutes < now.getHours() * 60 + now.getMinutes()) {
//       return false;
//     }
//     if (selectedDateTime.getDate() < now.getDate()) {
//       return false;
//     }
//     if (selectedDateTime.getDay() != now.getDay()) {
//       const newHoursIndex = (selectedDateTime.getDay() + 6) % 7;
//       const newHours = hours[newHoursIndex as keyof Hours];
//       return newHours.some(
//         (slot) => selectedMinutes >= slot.open && selectedMinutes <= slot.close
//       );
//     }
//     return todayHours.some(
//       (slot) => selectedMinutes >= slot.open && selectedMinutes <= slot.close
//     );
//   };
//   const validTime = validPickup(todayHours);
//   useEffect(() => {
//     onValidChange(validTime);
//   }),
//     [validTime];
