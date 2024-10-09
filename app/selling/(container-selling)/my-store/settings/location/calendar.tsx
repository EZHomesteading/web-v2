"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { format, addMonths, isValid, isSameDay, parseISO } from "date-fns";
import { Button } from "@/app/components/ui/button";
import TimeSlot from "./time-slot";
import CalendarDay from "./calendar-day";
import CustomSwitch from "./custom-calendar-switch";
import TimePicker from "./time-slot";
import ResponsiveSlidingLayout from "./panel";
import axios from "axios";
import { toast } from "sonner";
interface Exception {
  date: string;
  timeSlots: TimeSlot[];
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
interface p {
  location: any;
  index: number;
}
const Calendar = ({ location, index }: p) => {
  const [hours, setHours] = useState<Hours>({
    monthHours: [],
    exceptions:
      location?.hours?.exceptions?.map((ex: any) => ({
        ...ex,
        date: new Date(ex.date), // Ensure dates are parsed
      })) || [],
  });
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [visibleMonth, setVisibleMonth] = useState<Date>(currentDate);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [initialSelectionState, setInitialSelectionState] =
    useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<
    "select" | "deselect" | null
  >(null);
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  const selectedDaysCount = Object.values(selectedDays).filter(Boolean).length;
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowDimensions.width > 1023;
  const isTallMobile = !isDesktop && windowDimensions.height > 1000;

  const mainContentVariants = {
    open: { width: isDesktop ? "calc(100% - 384px)" : "100%" },
    closed: { width: "100%" },
  };

  const panelVariants = {
    desktop: {
      open: { x: 0, width: "384px", height: "100%" },
      closed: { x: "100%", width: 0, height: "100%" },
    },
    mobile: {
      open: {
        y: 0,
        height: isTallMobile ? "50%" : "100%",
        width: "100%",
      },
      closed: {
        y: "100%",
        height: 0,
        width: "100%",
      },
    },
  };
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (selectedDaysCount === 0) {
      setIsPanelOpen(false);
    } else if (isDesktop && selectedDaysCount === 1) {
      setIsPanelOpen(true);
    }
  }, [selectedDaysCount, isDesktop, setIsPanelOpen]);

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const createDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMouseDown = (day: number | null, month: number, year: number) => {
    if (day !== null) {
      const key = createDateKey(year, month + 1, day);
      const newSelectedState = !selectedDays[key];
      setSelectedDays((prev) => ({
        ...prev,
        [key]: newSelectedState,
      }));
      setIsSelecting(true);
      setSelectionMode(newSelectedState ? "select" : "deselect");
      setInitialSelectionState(newSelectedState);
    }
  };

  const handleMouseEnter = (
    day: number | null,
    month: number,
    year: number
  ) => {
    if (isSelecting && day !== null && selectionMode !== null) {
      const key = createDateKey(year, month + 1, day);
      const currentState = selectedDays[key];
      if (currentState !== initialSelectionState) {
        setSelectedDays((prev) => ({
          ...prev,
          [key]: initialSelectionState,
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionMode(null);
  };
  const convertMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${mins.toString().padStart(2, "0")}${period}`;
  };

  const renderCalendarForMonth = (year: number, month: number): JSX.Element => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const calendarDays: JSX.Element[] = [];
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const isLastInRow = (i + 1) % 7 === 0;
      const isLastRow = i >= 35;
      const key = isValidDay ? createDateKey(year, month + 1, day) : "";
      const isSelected = isValidDay && !!selectedDays[key];

      const currentDate = isValidDay
        ? new Date(Date.UTC(year, month, day))
        : null;
      const exception = currentDate
        ? hours.exceptions.find((ex) => isSameDay(ex.date, currentDate))
        : null;

      let exceptionTimes = null;
      if (exception && exception.timeSlots && exception.timeSlots.length > 0) {
        const { open, close } = exception.timeSlots[0];
        exceptionTimes = `${convertMinutesToTime(open)}-${convertMinutesToTime(
          close
        )}`;
      }

      calendarDays.push(
        <CalendarDay
          key={`${month}-${i}`}
          day={isValidDay ? day : null}
          isLastInRow={isLastInRow}
          isLastRow={isLastRow}
          onMouseDown={() => handleMouseDown(day, month, year)}
          onMouseEnter={() => handleMouseEnter(day, month, year)}
          isSelected={isSelected}
          exceptionTimes={exceptionTimes}
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

  const handleSaveChanges = async () => {
    const openMinutes = convertTimeToMinutes(openTime);
    const closeMinutes = convertTimeToMinutes(closeTime);

    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString, _]) => parseISO(dateString))
      .filter((date): date is Date => isValid(date))
      .sort((a, b) => a.getTime() - b.getTime());

    let updatedExceptions;

    if (isOpen) {
      const newExceptions: StoreException[] = selectedDates.map((date) => ({
        date: new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        ),
        timeSlots: [{ open: openMinutes, close: closeMinutes }],
      }));

      updatedExceptions = [
        ...hours.exceptions.filter(
          (exception) =>
            !newExceptions.some((newException) =>
              isSameDay(newException.date, exception.date)
            )
        ),
        ...newExceptions,
      ];
    } else {
      // If closed, remove exceptions for the selected days
      updatedExceptions = hours.exceptions.filter(
        (exception) =>
          !selectedDates.some((date) =>
            isSameDay(
              new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
              ),
              exception.date
            )
          )
      );
    }

    const updatedHours = {
      ...hours,
      exceptions: updatedExceptions,
    };

    setHours(updatedHours);

    // Update server
    await updateUserHours(updatedHours);
    setSelectedDays({});
    setIsPanelOpen(false);
  };

  const renderPanelContent = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-normal my-4">{getSelectionDescription}</h2>
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="flex justify-center mb-6">
          <CustomSwitch isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
        </div>
      </div>
      <div>
        <TimePicker
          top={true}
          value={openTime}
          onChange={(time) => setOpenTime(time)}
          isOpen={isOpen}
        />
        <TimePicker
          top={false}
          value={closeTime}
          onChange={(time) => setCloseTime(time)}
          isOpen={isOpen}
        />
      </div>
      <div className="flex items-center justify-evenly mt-4 space-x-2 w-full">
        <Button className="w-2/5" onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button
          className="w-2/5 bg-inherit"
          variant="outline"
          onClick={() => setIsPanelOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

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
          const distance = Math.abs(rect.top - containerRef.current!.offsetTop);
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
  const [showModifyButton, setShowModifyButton] = useState(false);
  const modifyButtonTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedDaysCount > 0 && !isPanelOpen) {
      if (modifyButtonTimerRef.current) {
        clearTimeout(modifyButtonTimerRef.current);
      }
      modifyButtonTimerRef.current = setTimeout(() => {
        setShowModifyButton(true);
      }, 1);
    } else {
      setShowModifyButton(false);
      if (modifyButtonTimerRef.current) {
        clearTimeout(modifyButtonTimerRef.current);
      }
    }

    return () => {
      if (modifyButtonTimerRef.current) {
        clearTimeout(modifyButtonTimerRef.current);
      }
    };
  }, [selectedDaysCount, isPanelOpen]);
  const getSelectionDescription = useMemo(() => {
    if (selectedDaysCount === 0) return "";

    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString, _]) => {
        const parsedDate = parseISO(dateString);
        return isValid(parsedDate) ? parsedDate : null;
      })
      .filter((date): date is Date => date !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    if (selectedDates.length === 0) {
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

    return `Modify Hours for ${selectedDaysCount} day${
      selectedDaysCount !== 1 ? "s" : ""
    }`;
  }, [selectedDays, selectedDaysCount]);

  const renderCalendarContent = () => (
    <div className="flex flex-col h-full select-none">
      <div className="sticky top-0 z-40 w-full sheet">
        <div className="grid grid-cols-7 gap-px w-full border-b border-gray-200">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold p-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex-grow overflow-y-auto"
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsSelecting(false);
          setSelectionMode(null);
        }}
        style={{ height: "calc(100vh - 150px)" }} // Adjust this value as needed
      >
        <div className="pt-4">{renderAllMonths()}</div>
      </div>

      {showModifyButton && (
        <div className="fixed bottom-[120px] left-1/2 transform -translate-x-1/2 z-50">
          <Button
            className="bg-slate-900 text-white hover:bg-slate-500 transition-colors duration-200 rounded-full shadow-lg"
            onClick={() => setIsPanelOpen(true)}
          >
            {getSelectionDescription}
          </Button>
        </div>
      )}
    </div>
  );
  const [openTime, setOpenTime] = useState<string>("09:00 AM");
  const [closeTime, setCloseTime] = useState<string>("05:00 PM");

  const convertTimeToMinutes = (time: string): number => {
    const [timeStr, period] = time.split(" ");
    const [hours, minutes] = timeStr.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (period === "PM" && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === "AM" && hours === 12) {
      totalMinutes = 0;
    }

    return totalMinutes;
  };

  const updateUserHours = async (updatedHours: Hours) => {
    try {
      const response = await axios.post(
        "/api/useractions/update/location-hours",
        {
          location: [
            {
              ...location,
              hours: updatedHours,
            },
          ],
          locationIndex: index,
        }
      );

      if (response.status === 200) {
        toast.success("Hours updated successfully");
      }
    } catch (error) {
      console.error("Error updating hours:", error);
    }
  };

  return (
    <ResponsiveSlidingLayout
      isPanelOpen={isPanelOpen}
      onPanelClose={() => setIsPanelOpen(false)}
      panel={renderPanelContent()}
      mainContentVariants={mainContentVariants}
      panelVariants={panelVariants}
      isDesktop={isDesktop}
      isTallMobile={isTallMobile}
    >
      {renderCalendarContent()}
    </ResponsiveSlidingLayout>
  );
};

export default Calendar;
