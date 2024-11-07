// export default SetCustomPickupDeliveryCalendar;
"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  format,
  addMonths,
  isValid,
  isSameDay,
  parseISO,
  isBefore,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Location, TimeSlot } from "@prisma/client";
import axios from "axios";
import {
  convertTimeStringToMinutes,
  createDateKey,
  daysOfWeek,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { outfitFont } from "@/components/fonts";
import {
  CalendarDayCart,
  DeliveryPickupToggleMode,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import SetCustomPickupDeliveryPanel from "./panel.basket";
import { PiArrowLeftThin, PiArrowRightThin } from "react-icons/pi";
import useMediaQuery from "@/hooks/media-query";
import TimePicker from "./time.basket";

interface p {
  location: any;
  mode?: DeliveryPickupToggleMode;
}
const SetCustomPickupDeliveryCalendar = ({ location, mode }: p) => {
  const hours = {
    delivery:
      location?.hours?.delivery?.map((ex: any) => ({
        ...ex,
        date: new Date(ex.date),
      })) || [],
    pickup:
      location?.hours?.pickup?.map((ex: any) => ({
        ...ex,
        date: new Date(ex.date),
      })) || [],
  };
  const [startMonth, setStartMonth] = useState(new Date());

  const [userClosedPanel, setUserClosedPanel] = useState(false);
  const [showModifyButton, setShowModifyButton] = useState(false);
  const modifyButtonTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentDate = new Date();
  const containerRef = useRef<HTMLDivElement | null>(null);
  type DaySelection = { [key: string]: boolean };
  const [selectedDay, setSelectedDay] = useState<DaySelection>({});
  const [isBasePanelOpen, setIsBasePanelOpen] = useState(false);
  const [time, setTime] = useState<number>(540);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const panelSide = windowDimensions.width > 1150;

  const handleMouseDown = (day: number | null, month: number, year: number) => {
    if (day !== null) {
      const key = createDateKey(year, month + 1, day);
      const date = parseISO(key);
      const { currentHours } = getSellerHours();

      if (selectedDay[key]) {
        setSelectedDay({});
        return;
      }

      if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
        toast.error(`${format(date, "MMM d")} has already passed`);
        return;
      }

      const hasHours = currentHours?.some((hourSet: any) =>
        isSameDay(parseISO(hourSet.date.toISOString()), date)
      );

      if (!hasHours) {
        toast.error(`Seller is closed on ${format(date, "MMMM d, yyyy")}`);
        return;
      }

      setSelectedDay({ [key]: true });
    }
  };

  const mainContentVariants = {
    open: { width: "100%" },
    closed: { width: "100%" },
  };

  const getSelectionDescription = useMemo(() => {
    const selectedDateKey = Object.keys(selectedDay)[0];
    if (!selectedDateKey) return "";

    const date = parseISO(selectedDateKey);
    return isValid(date) ? `Set Pickup Time for ${format(date, "MMM d")}` : "";
  }, [selectedDay]);

  useEffect(() => {
    const hasSelectedDate = Object.keys(selectedDay).length > 0;

    if (hasSelectedDate && !isBasePanelOpen) {
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
  }, [selectedDay, isBasePanelOpen]);

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const getSellerHours = () => {
    if (mode === DeliveryPickupToggleMode.DELIVERY) {
      return {
        currentHours: hours.delivery,
      };
    } else {
      return {
        currentHours: hours.pickup,
      };
    }
  };

  const handleTimeSlotChange = (newTime: string) => {
    const minutes = convertTimeStringToMinutes(newTime);
    setTime(minutes);
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendarForMonth = (year: number, month: number): JSX.Element => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const { currentHours } = getSellerHours();
    const calendarDays: JSX.Element[] = [];
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const key = isValidDay ? createDateKey(year, month + 1, day) : "";
      const isSelected = isValidDay && selectedDay && !!selectedDay[key];

      let timeSlots: TimeSlot[] = [];
      if (isValidDay) {
        const currentDate = parseISO(key);
        const matchingHours = currentHours?.find((hourSet: any) =>
          isSameDay(parseISO(hourSet.date.toISOString()), currentDate)
        );
        timeSlots = matchingHours?.timeSlots || [];
      }

      calendarDays.push(
        <CalendarDayCart
          key={`${month}-${i}`}
          day={isValidDay ? day : null}
          onMouseDown={() => handleMouseDown(day, month, year)}
          isSelected={isSelected}
          timeSlots={timeSlots}
        />
      );
    }

    return (
      <div
        key={month}
        data-month={format(new Date(year, month), "MMM yyyy")}
        className={`sm:px-1 ${outfitFont.className}`}
      >
        <div className="text-lg font-semibold mb-2  w-fit">
          {format(new Date(year, month), "MMM yyyy")}
        </div>
        <div className="  grid grid-cols-7 w-full gap-x-4">
          {daysOfWeek.map((day: string, index: number) => (
            <div key={index} className="mr-2 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="  grid grid-cols-7 w-full gap-2">{calendarDays}</div>
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () =>
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      setUserClosedPanel(false);
    }
  }, [selectedDay]);

  const renderMonths = (): JSX.Element[] => {
    const month1 = startMonth;
    const month2 = addMonths(startMonth, 1);
    const months = [
      renderCalendarForMonth(month1.getFullYear(), month1.getMonth()),
      renderCalendarForMonth(month2.getFullYear(), month2.getMonth()),
    ];
    months.push();
    return months;
  };
  const over_600px = useMediaQuery("(min-width: 600px)");
  let num: number = 2;
  const handleBack = () => setStartMonth((prev) => subMonths(prev, num));
  const handleForward = () => setStartMonth((prev) => addMonths(prev, num));
  return (
    <div className="relative select-none">
      <div className="flex justify-between items-center mb-4 w-full">
        <PiArrowLeftThin
          onClick={handleBack}
          className={`hover:cursor-pointer text-[2rem] rounded-full p-1 border shadow-md`}
        />
        {showModifyButton && selectedDay && (
          <button
            className={`${
              !selectedDay && "!hidden"
            } z-50 bg-slate-900 text-white md:text-md p-4 font-semibold md:w-[250px] w-fit text-xs absolute top-[-10] left-1/2 -translate-x-1/2 hover:bg-slate-500 transition-colors duration-200 rounded-full shadow-lg`}
            onClick={() => {
              setIsBasePanelOpen(true);
              setShowModifyButton(false);
            }}
          >
            {getSelectionDescription}
          </button>
        )}
        <PiArrowRightThin
          onClick={handleForward}
          className={`hover:cursor-pointer text-[2rem]  rounded-full p-1 border shadow-md`}
        />
      </div>

      <SetCustomPickupDeliveryPanel
        mode={mode}
        isBasePanelOpen={isBasePanelOpen}
        setIsBasePanelOpen={setIsBasePanelOpen}
        handleTimeChange={handleTimeSlotChange}
        over_600px={over_600px}
      >
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-3 md:space-y-0 pt-3">
          {renderMonths()}
        </div>
      </SetCustomPickupDeliveryPanel>
    </div>
  );
};

export default SetCustomPickupDeliveryCalendar;
