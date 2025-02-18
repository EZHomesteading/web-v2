import React, { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DeliveryPickupToggleMode } from "@/app/(white_nav_layout)/my-basket/components/helper-components-calendar";

interface TimeSlot {
  open: number;
  close: number;
}

interface DayHours {
  date: string;
  timeSlots: TimeSlot[];
}

interface Location {
  hours?: {
    pickup?: DayHours[];
    delivery?: DayHours[];
    [key: string]: DayHours[] | undefined;
  };
}

interface WeeklyHoursProps {
  location: Location;
  mode: DeliveryPickupToggleMode;
}

const WeeklyHours: React.FC<WeeklyHoursProps> = ({ location, mode }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const formatTime = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
  };

  const getWeekDates = (offset: number): Date[] => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + offset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setWeekOffset((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const weekDates = getWeekDates(weekOffset);
  const hours = location.hours?.[mode.toLowerCase()] || [];

  const hoursMap = new Map<string, DayHours>(
    hours.map((day) => [new Date(day.date).toDateString(), day])
  );

  const firstDate = weekDates[0];
  const lastDate = weekDates[6];
  const monthRange =
    firstDate.getMonth() === lastDate.getMonth()
      ? firstDate.toLocaleString("en-US", { month: "long" })
      : `${firstDate.toLocaleString("en-US", {
          month: "short",
        })} - ${lastDate.toLocaleString("en-US", { month: "short" })}`;

  const WeeklyHoursContent = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigateWeek("prev")}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {monthRange} {firstDate.getFullYear()}
        </span>
        <button
          onClick={() => navigateWeek("next")}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="text-xs text-gray-600 flex gap-2">
        {weekDates.map((date, index) => {
          const isToday = new Date().toDateString() === date.toDateString();
          const dayName = date.toLocaleString("en-US", { weekday: "short" });
          const formattedDate = date.toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
          });

          const dayHours = hoursMap.get(date.toDateString());
          const timeSlots = dayHours?.timeSlots || [];

          return (
            <div
              key={index}
              className={`flex flex-col items-center min-w-16 ${
                isToday ? "font-semibold text-blue-600" : ""
              }`}
            >
              <span className="font-medium">{dayName}</span>
              <span className="text-gray-400 mb-1">{formattedDate}</span>
              {timeSlots.length > 0 ? (
                timeSlots.map((slot: TimeSlot, slotIndex: number) => (
                  <span key={slotIndex} className="whitespace-nowrap">
                    {formatTime(slot.open)}-{formatTime(slot.close)}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          View Hours
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-4 max-sm:left-1/2 max-sm:-translate-x-1/2"
        align="center"
        side="bottom"
      >
        <WeeklyHoursContent />
      </PopoverContent>
    </Popover>
  );
};

export default WeeklyHours;
