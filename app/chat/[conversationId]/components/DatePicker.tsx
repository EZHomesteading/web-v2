"use client";
import { SheetContent } from "@/app/components/ui/sheet";
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
import { Outfit } from "next/font/google";
import { useEffect, useState } from "react";
const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  hours: ExtendedHours;

  onSetTime: any;
}

const CustomTime = ({ hours, onSetTime }: Props) => {
  const now = new Date();
  const [date, setDate] = useState<Date | undefined>(now); //current time
  const [options, setOptions] = useState<string[]>([]); // array of times with 15 minute intervals

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
    const newHours = hours[newHoursIndex as keyof ExtendedHours];
    if (newHours === null) {
      return; //early retur if co-op is closed
    }
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
    const [time, hours, minutes, meridiem] = matchResult;
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
      onSetTime(insertTimeIntoDatetime(date, option));
    }
  };

  return (
    <div>
      <SheetContent
        side="top"
        className="flex flex-col bg-transparent md:flex-row items-center  justify-center h-screen w-screen"
      >
        <div className="w-fit border-none shadow-none">
          <div className="grid gap-4">
            <div>
              <div className="px-1 bg-white py-[.35rem] rounded-lg border-gray-200 border-[1px]">
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
                disabled={{ before: now }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <ScrollArea className="h-[16.1rem] w-full rounded-md border bg-white mt-1">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Open Hours
              </h4>
              {!options.length ? (
                <div>No available times on this day</div>
              ) : null}
              {options.map((option) => (
                <div key={option} className="hover:bg-slate">
                  <div
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
    </div>
  );
};

export default CustomTime;
