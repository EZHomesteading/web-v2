"use client";

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

interface StatusProps {
  hours: Hours;
  onValidChange: any;
  index: number;
}

const DateState = ({ hours }: StatusProps) => {
  const now = new Date();
  const [date, setDate] = useState<Date | undefined>(now);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(now);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedMinutes, setSelectedMinutes] = useState(
    selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes()
  );

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

  const setTime = (option: string) => {
    console.log(date, option);
  };
  return (
    <>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"}>Hours</Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit border-none shadow-none ">
            <div className="grid gap-4">
              <div className="bg-white">
                <HoursDisplay coOpHours={hours} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
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
            disabled={{ before: now, after: now }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Options</h4>
          {!options.length ? <div>No available times on this day</div> : null}
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
    </>
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
