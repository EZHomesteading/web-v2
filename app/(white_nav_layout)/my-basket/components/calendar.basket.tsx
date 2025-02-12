// export default SetCustomPickupDeliveryCalendar;
"use client";
import { useState, useEffect, useRef, useMemo, Key } from "react";
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
import { basket_time_type, orderMethod, TimeSlot } from "@prisma/client";
import {
  convertMinutesToTimeString,
  convertTimeStringToMinutes,
  createDateKey,
  daysOfWeek,
  week_day_mmm_dd_yy_time,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { OutfitFont } from "@/components/fonts";
import {
  CalendarDayCart,
  DeliveryPickupToggleMode,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { PiArrowLeftThin, PiArrowRightThin } from "react-icons/pi";
import TimePicker from "./time.basket";
import { Basket_Selected_Time_Type } from "basket";
import axios from "axios";

interface p {
  location: any;
  mode?: DeliveryPickupToggleMode;
  onClose: () => void;
  basket: Basket_Selected_Time_Type;
}

const SetCustomPickupDeliveryCalendar = ({
  location,
  mode,
  onClose,
  basket,
}: p) => {
  const [basketState, setBasketState] = useState<Basket_Selected_Time_Type>({
    ...basket,
    orderMethod: basket.orderMethod,
    selected_time_type: null,
  });

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
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const [showModifyButton, setShowModifyButton] = useState(false);
  const modifyButtonTimerRef = useRef<NodeJS.Timeout | null>(null);

  type DaySelection = { [key: string]: boolean };
  const [selectedDay, setSelectedDay] = useState<DaySelection>({});

  const [isBasePanelOpen, setIsBasePanelOpen] = useState(false);
  const [time, setTime] = useState<number>(540);
  const getTimeSlotsForSelectedDay = () => {
    const selectedDateKey = Object.keys(selectedDay)[0];
    if (!selectedDateKey) return [];

    const currentDate = parseISO(selectedDateKey);
    const { currentHours } = getSellerHours();

    const matchingHours = currentHours.find((hourSet: any) =>
      isSameDay(parseISO(hourSet.date.toISOString()), currentDate)
    );

    return matchingHours?.timeSlots || [];
  };

  const handleMouseDown = (day: number | null, month: number, year: number) => {
    if (day !== null) {
      const key = createDateKey(year, month + 1, day);
      const date = parseISO(key);
      const { currentHours } = getSellerHours();

      if (selectedDay[key]) {
        setSelectedDay({});
        setSelectedDateTime(null);
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

      const newDateTime = new Date(date.getTime() + time * 60000);
      setSelectedDateTime(newDateTime);
    }
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

    const selectedDateKey = Object.keys(selectedDay)[0];
    if (selectedDateKey) {
      const selectedDate = parseISO(selectedDateKey);
      const newDateTime = new Date(selectedDate.getTime() + minutes * 60000);
      setSelectedDateTime(newDateTime);
    }
    console.log(selectedDateTime);
  };

  const saveChanges = async () => {
    if (!selectedDateTime) {
      toast.error("Please select both a date and a time");
      return;
    }

    const timeSlots = getTimeSlotsForSelectedDay();
    if (timeSlots.length === 0) {
      toast.error("No available time slots for selected date");
      return;
    }

    const currentTime = time;
    const isTimeValid = timeSlots.some(
      (slot: { open: number; close: number }) =>
        currentTime >= slot.open && currentTime <= slot.close
    );

    if (!isTimeValid) {
      toast.error("Selected time is outside of available hours");
      return;
    }

    try {
      const payload = {
        id: basketState.id,
        deliveryDate:
          basketState.orderMethod === orderMethod.DELIVERY
            ? selectedDateTime.toISOString()
            : null,
        pickupDate:
          basketState.orderMethod === orderMethod.PICKUP
            ? selectedDateTime.toISOString()
            : null,
        orderMethod: basketState.orderMethod,
        proposedLoc: basketState.proposedLoc,
        items: basketState.items,
        time_type: basket_time_type.CUSTOM,
      };

      console.log("Payload being sent to backend:", payload);

      const res = await axios.post("/api/baskets/update", payload);

      if (res.status === 200) {
        toast.success("Basket was updated");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update basket");
      console.error("Update error:", error);
    }
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
        className={`sm:px-1 ${OutfitFont.className}`}
      >
        <div className="text-lg font-semibold mb-2 w-fit">
          {format(new Date(year, month), "MMM yyyy")}
        </div>
        <div className="grid grid-cols-7 w-full gap-x-4">
          {daysOfWeek.map((day: string, index: number) => (
            <div key={index} className="mr-2 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 w-full gap-2">{calendarDays}</div>
      </div>
    );
  };
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
  const handleBack = () => setStartMonth((prev) => subMonths(prev, 2));
  const handleForward = () => setStartMonth((prev) => addMonths(prev, 2));
  return (
    <div className="relative select-none h-[100%]">
      <div className="flex justify-between items-center mw-full mb-2">
        <PiArrowLeftThin
          onClick={handleBack}
          className="hover:cursor-pointer text-[2rem] rounded-full p-1 border shadow-md"
        />
        {showModifyButton && selectedDay && (
          <button
            className="z-50 bg-slate-900 text-white md:text-md p-2 font-semibold md:w-[250px] w-fit text-xs absolute top-[-10] left-1/2 -translate-x-1/2 hover:bg-slate-500 transition-colors duration-200 rounded-full shadow-lg"
            onClick={() => setIsBasePanelOpen(true)}
          >
            {getSelectionDescription}
          </button>
        )}
        <PiArrowRightThin
          onClick={handleForward}
          className="hover:cursor-pointer text-[2rem] rounded-full p-1 border shadow-md"
        />
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8 space-y-0 md:space-y-0 pt- h-[calc(100%)] !overflow-y-auto">
        {renderMonths()}
      </div>

      {isBasePanelOpen && (
        <div className="absolute inset-0 z-[102] bg-white rounded-xl  pointer-events-auto">
          <Button
            onClick={() => setIsBasePanelOpen(false)}
            className="z-50 bg-slate-900 text-white md:text-md h-8 px-4 font-semibold w-[150px] md:w-[250px] text-xs absolute top-[-10] left-1/2 -translate-x-1/2 hover:bg-slate-500 transition-colors duration-200 rounded-full shadow-lg"
          >
            Back to Calendar
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 w-full ">
            <div
              className={`w-full text-start pt-2 flex flex-col items-center justify-start`}
            >
              {" "}
              <div className={`text-lg font-semibold mb-2 w-fit`}>
                Available Times
              </div>
              <div>
                {getTimeSlotsForSelectedDay().length > 0 ? (
                  getTimeSlotsForSelectedDay().map(
                    (
                      slot: { open: number; close: number },
                      index: number | null
                    ) => (
                      <div
                        key={index}
                        className="text-xs lg:text-sm text-black mt-1 overflow-y-auto"
                      >
                        {`${convertMinutesToTimeString(
                          slot.open
                        )} - ${convertMinutesToTimeString(slot.close)}`}
                      </div>
                    )
                  )
                ) : (
                  <div>No available times</div>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <TimePicker
                value={convertMinutesToTimeString(time)}
                onChange={(time) => handleTimeSlotChange(time)}
                mode={mode}
              />
            </div>{" "}
          </div>{" "}
          <div className="flex w-full px-2 justify-between border-t pt-2 mt-6 ">
            <button
              className={`underline text-black ${
                !basketState.pickupDate &&
                !basketState.deliveryDate &&
                "cursor-not-allowed pointer-events-none text-neutral-500"
              }`}
              onClick={() =>
                setBasketState((prev) => ({
                  ...prev,
                  deliveryDate: null,
                  pickupDate: null,
                }))
              }
            >
              Reset
            </button>
            <button
              className="text-white bg-black px-3 py-2 rounded-3xl"
              onClick={saveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetCustomPickupDeliveryCalendar;
