"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { format, addMonths, isValid, getDay } from "date-fns";

import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
interface Exception {
  date: string;
  timeSlots: TimeSlot[];
}
interface CalendarDayProps {
  day: number | null;
  isLastInRow: boolean;
  isLastRow: boolean;
  onMouseDown: (day: number | null) => void;
  onMouseEnter: (day: number | null) => void;
  isSelected: boolean;
}
interface CustomSwitchProps {
  isOpen: boolean;
  onToggle: () => void;
}
interface TimeSlot {
  open: number;
  close: number;
}

interface DayHours {
  day: number;
  timeSlots: TimeSlot[];
}

interface MonthHours {
  month: number;
  days: DayHours[];
}

interface StoreException {
  date: Date;
  timeSlots?: TimeSlot[];
}

interface Hours {
  monthHours: MonthHours[];
  exceptions: StoreException[];
}
const CustomSwitch: React.FC<CustomSwitchProps> = ({ isOpen, onToggle }) => {
  return (
    <div
      className="relative w-36 h-10 bg-gray-300 rounded-full cursor-pointer"
      onClick={onToggle}
    >
      <div className="absolute inset-0 flex items-center justify-evenly text-sm font-medium">
        <span className={`z-10 ${isOpen ? "text-gray-500" : "text-white"}`}>
          Open
        </span>
        <span className={`z-10 ${isOpen ? "text-white" : "text-gray-500"}`}>
          Closed
        </span>
      </div>
      <div
        className={`
            absolute top-1 bottom-1 w-1/2 bg-slate-900 rounded-full
            transition-all duration-300 ease-in-out
            ${isOpen ? "right-1" : "left-1"}
          `}
      />
    </div>
  );
};
const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isLastInRow,
  isLastRow,
  onMouseDown,
  onMouseEnter,
  isSelected,
}) => (
  <div
    onMouseDown={() => onMouseDown(day)}
    onMouseEnter={() => onMouseEnter(day)}
    className={`
        ${day !== null ? "border border-gray-200 h-36 cursor-pointer" : "h-12"}
        ${isLastInRow ? "border-r-0" : ""}
        ${isLastRow ? "border-b-0" : ""}
        ${isSelected && day !== null ? "bg-emerald-200  border-none" : ""}
        relative
      `}
  >
    {day !== null && (
      <div className="p-2">
        <div className={`text-sm font-light ${isSelected ? "underline" : ""}`}>
          {day}
        </div>
      </div>
    )}
    {isSelected && day !== null && (
      <div className="absolute inset-0 bg-slate-700 opacity-50 pointer-events-none"></div>
    )}
  </div>
);

const TimeSlot: React.FC<{
  time: string;
  onMouseDown: (time: string) => void;
  onMouseEnter: (time: string) => void;
  isSelected: boolean;
  isDisabled: boolean;
}> = ({ time, onMouseDown, onMouseEnter, isDisabled, isSelected }) => (
  <div
    onMouseDown={() => !isDisabled && onMouseDown(time)}
    onMouseEnter={() => !isDisabled && onMouseEnter(time)}
    className={`
        border border-gray-200 h-12 cursor-pointer py-3  text-center !font-extralight
        ${isSelected ? "bg-slate-700 text-white border-none" : ""}
        ${isDisabled ? " text-gray-400 line-through cursor-not-allowed" : ""}
      `}
  >
    <div className="text-sm font-light">{time}</div>
  </div>
);

const StoreHoursEditor: React.FC = () => {
  const [hours, setHours] = useState<Hours>({ monthHours: [], exceptions: [] });
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  console.log("exceptions", exceptions);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [visibleMonth, setVisibleMonth] = useState<Date>(currentDate);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{
    [key: string]: boolean;
  }>({});

  const [selectionMode, setSelectionMode] = useState<
    "select" | "deselect" | null
  >(null);
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const handleMouseDown = (day: number | null, month: number, year: number) => {
    if (day !== null) {
      const key = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      setSelectedDate(key);
      setSelectedDays((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      setIsSelecting(true);
      setSelectionMode((prev) => (prev === "select" ? "deselect" : "select"));
    }
  };

  const handleMouseEnter = (
    day: number | null,
    month: number,
    year: number
  ) => {
    if (isSelecting && day !== null && selectionMode !== null) {
      const key = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      setSelectedDays((prev) => ({
        ...prev,
        [key]: selectionMode === "select",
      }));
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionMode(null);
  };

  const renderCalendarForMonth = (year: number, month: number): JSX.Element => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const calendarDays: JSX.Element[] = [];
    const totalCells = 42; // 6 rows * 7 days

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const isLastInRow = (i + 1) % 7 === 0;
      const isLastRow = i >= 35; // Last row always starts at index 35
      const key = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const isSelected = isValidDay && !!selectedDays[key];

      calendarDays.push(
        <CalendarDay
          key={`${month}-${i}`}
          day={isValidDay ? day : null}
          isLastInRow={isLastInRow}
          isLastRow={isLastRow}
          onMouseDown={() => handleMouseDown(day, month, year)}
          onMouseEnter={() => handleMouseEnter(day, month, year)}
          isSelected={isSelected}
        />
      );
    }

    return (
      <div
        key={month}
        className="mb-8"
        data-month={format(new Date(year, month), "MMMM yyyy")}
      >
        <div className="text-2xl font-normal mb-4 px-2">
          {format(new Date(year, month), "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 w-full gap-px">{calendarDays}</div>
      </div>
    );
  };

  const renderAllMonths = (): JSX.Element[] => {
    const year = currentDate.getFullYear();
    const calendarMonths: JSX.Element[] = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(currentDate, i);
      calendarMonths.push(
        renderCalendarForMonth(monthDate.getFullYear(), monthDate.getMonth())
      );
    }

    return calendarMonths;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const monthElements =
          containerRef.current.querySelectorAll<HTMLDivElement>("[data-month]");
        let closestMonth: string | null = null;
        let minDistance = Infinity;

        monthElements.forEach((monthElement) => {
          const rect = monthElement.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < minDistance) {
            minDistance = distance;
            closestMonth = monthElement.getAttribute("data-month");
          }
        });

        if (closestMonth) {
          const newVisibleMonth = new Date(
            `${closestMonth} 1, ${currentDate.getFullYear()}`
          );
          setVisibleMonth(newVisibleMonth);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      container.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [currentDate]);

  const selectedDaysCount = Object.values(selectedDays).filter(Boolean).length;

  const getSelectionDescription = useMemo(() => {
    if (selectedDaysCount === 0) return "";

    console.log("Selected days object:", selectedDays);

    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString, _]) => {
        console.log("Processing date string:", dateString);
        // Assuming the date string is in the format "YYYY-M-D"
        const [year, month, day] = dateString.split("-").map(Number);
        // Use the month as-is, no need to subtract 1
        const parsedDate = new Date(year, month, day);
        console.log("Parsed date:", parsedDate);
        return isValid(parsedDate) ? parsedDate : null;
      })
      .filter((date): date is Date => date !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    console.log("Filtered and sorted selected dates:", selectedDates);

    if (selectedDates.length === 0) {
      console.log("No valid dates found");
      return "Invalid date selection";
    }

    if (selectedDates.length === 1) {
      return `Modify Hours for ${format(selectedDates[0], "MMM d")}`;
    }

    const isContiguousRange = selectedDates.every((date, index) => {
      if (index === 0) return true;
      const prevDate = selectedDates[index - 1];
      const diffInDays = Math.round(
        (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays === 1;
    });

    if (isContiguousRange) {
      const startDate = selectedDates[0];
      const endDate = selectedDates[selectedDates.length - 1];
      return `Modify Hours for ${format(startDate, "MMM d")} - ${format(
        endDate,
        "MMM d"
      )}`;
    }

    // Default case: show number of selected days
    return `Modify Hours for ${selectedDaysCount} day${
      selectedDaysCount !== 1 ? "s" : ""
    }`;
  }, [selectedDays, selectedDaysCount]);
  const [isOpen, setIsOpen] = useState(true);

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleTimeSlotChange = () => {
    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString]) => dateString);

    if (selectedDates.length === 0) return;

    const sortedTimes = Object.entries(selectedTimeSlots)
      .filter(([_, isSelected]) => isSelected)
      .map(([time]) => convertTimeToMinutes(time))
      .sort((a, b) => a - b);

    const timeSlots: TimeSlot[] = [];
    let currentSlot: TimeSlot | null = null;

    for (let i = 0; i < sortedTimes.length; i++) {
      if (currentSlot === null) {
        currentSlot = { open: sortedTimes[i], close: sortedTimes[i] + 30 };
      } else if (sortedTimes[i] === currentSlot.close) {
        currentSlot.close += 30;
      } else {
        timeSlots.push(currentSlot);
        currentSlot = { open: sortedTimes[i], close: sortedTimes[i] + 30 };
      }
    }

    if (currentSlot !== null) {
      timeSlots.push(currentSlot);
    }

    setExceptions((prev) => {
      const updatedExceptions = [...prev];
      selectedDates.forEach((date) => {
        const existingIndex = updatedExceptions.findIndex(
          (ex) => ex.date === date
        );
        if (existingIndex !== -1) {
          updatedExceptions[existingIndex] = { date, timeSlots };
        } else {
          updatedExceptions.push({ date, timeSlots });
        }
      });
      return updatedExceptions;
    });
  };

  const applyChanges = () => {
    handleTimeSlotChange();
    console.log("Updated exceptions:", exceptions);
    setSelectedDate(null);
    setSelectedDays({});
    setSelectedTimeSlots({});
  };

  const handleTimeSlotMouseDown = (time: string) => {
    setSelectedTimeSlots((prev) => ({
      ...prev,
      [time]: !prev[time],
    }));
  };

  const handleTimeSlotMouseEnter = (time: string) => {
    if (isSelecting) {
      setSelectedTimeSlots((prev) => ({
        ...prev,
        [time]: selectionMode === "select",
      }));
    }
  };

  const renderTimeSlots = () => {
    const times = Array.from({ length: 48 }, (_, i) =>
      format(new Date(0, 0, 0, Math.floor(i / 2), (i % 2) * 30), "HH:mm")
    );

    return times.map((time) => (
      <TimeSlot
        key={time}
        time={time}
        onMouseDown={() => handleTimeSlotMouseDown(time)}
        onMouseEnter={() => handleTimeSlotMouseEnter(time)}
        isSelected={!!selectedTimeSlots[time]}
        isDisabled={!isOpen}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center h-screen select-none">
      <div className="sticky top-20 sheet z-40 w-full ">
        <div className="grid grid-cols-7 gap-px w-full border-b border-gray-200">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold p-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-full overflow-y-auto pt-10 sm:pt-0 sm:pl-1"
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsSelecting(false);
          setSelectionMode(null);
        }}
      >
        <div className="pt-4">{renderAllMonths()}</div>
      </div>

      {selectedDaysCount > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2">
              <Button className="bg-slate-900 text-white hover:bg-slate-500 transition-colors duration-200 rounded-full">
                {getSelectionDescription}
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="sheet px-4">
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-normal my-4">
                {getSelectionDescription}
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex justify-center mb-6">
                  <CustomSwitch
                    isOpen={isOpen}
                    onToggle={() => setIsOpen(!isOpen)}
                  />
                </div>
              </div>
              <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 px-1 ">
                  {renderTimeSlots()}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTimeSlots({})}
                >
                  Clear Selection
                </Button>
                <Button
                  className="bg-slate-700 text-white hover:bg-slate-600"
                  onClick={applyChanges}
                >
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default StoreHoursEditor;
