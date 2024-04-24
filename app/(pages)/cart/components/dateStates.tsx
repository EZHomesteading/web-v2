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

interface StatusProps {
  hours: Hours;
  onValidChange: any;
  index: number;
}

const DateState = ({ hours }: StatusProps) => {
  const [date, setDate] = React.useState<Date>();
  const now = new Date();
  const [selectedDateTime, setSelectedDateTime] = useState(now);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedMinutes, setSelectedMinutes] = useState(
    selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes()
  );
  //
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins} ${ampm}`;
  };
  const buildArray = async () => {
    if (date === undefined) {
      return;
    }
    const newHoursIndex = (date.getDay() + 6) % 7;
    const newHours = hours[newHoursIndex as keyof Hours];
    const resultantArray = [];
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
  return (
    <div className="relative">
      <Sheet>
        <SheetTrigger className="border-black border-[1px] px-2 py-2 rounded-lg shadow-lg">
          Set Pickup Time
          {/* {user?.cartItem.pickup ? <>{pickuptime}</> : <>Set Pickup Time</>} */}
        </SheetTrigger>
        <SheetContent
          side="top"
          className="rounded-lg px-2 py-2 h-screen sm:h-fit sm:w-fit  w-[400px]"
        >
          <Sheet>
            <div className="">
              <Button className="mr-2">As soon as possible</Button>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <ScrollArea className="h-[16.1rem] w-full rounded-md border mt-1">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                      Open Hours
                    </h4>
                    {options.map((option) => (
                      <>
                        <div key={option} className="text-sm">
                          {option}
                        </div>
                        <Separator className="my-2" />
                      </>
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
