"use client";

import * as React from "react";
import { format, getDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

const coOpHours = {
  0: { open: 600, close: 960 }, // Sunday: 10:00 AM to 4:00 PM
  1: { open: 540, close: 1020 }, // Monday: 9:00 AM to 5:00 PM
  2: { open: 540, close: 1050 }, // and so on...
  3: { open: 540, close: 1070 },
  4: { open: 540, close: 1080 },
  5: { open: 540, close: 1020 },
  6: { open: 600, close: 960 }, // Saturday
};

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();
  const [hours, setHours] = React.useState<{ open: number; close: number }>();

  const handleDateSelect = (selectedDate: any) => {
    setDate(selectedDate);
    const dayOfWeek = getDay(selectedDate); // Get the day of week index (0-6)
    const dailyHours = coOpHours[dayOfWeek];
    setHours(dailyHours); // Store the hours for the selected day
  };

  return (
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
          {date ? (
            format(date, "PPP") +
            ` (Open: ${format(
              new Date().setMinutes(hours!.open),
              "p"
            )} - Close: ${format(new Date().setMinutes(hours!.close), "p")})`
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
