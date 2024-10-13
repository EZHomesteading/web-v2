"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  format,
  addMonths,
  isValid,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import { Button } from "@/app/components/ui/button";
import TimeSlot from "./time-slot";
import CalendarDay from "./calendar-day";
import CustomSwitch from "./custom-calendar-switch";
import TimePicker from "./time-slot";
import { PanelProps } from "./panel";
import axios from "axios";
import { toast } from "sonner";
import StackingPanelLayout from "./panel";

import {
  DeliveryPickupToggle,
  DeliveryPickupToggleMode,
  Mode,
  ViewEditToggle,
} from "./delivery-pickup-toggle";
import { PiGearThin } from "react-icons/pi";
import { UserRole } from "@prisma/client";

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
  deliveryHours: MonthHours[];
  pickupHours: MonthHours[];
  deliveryExceptions: StoreException[];
  pickupExceptions: StoreException[];
}
interface p {
  location: any;
  index: number;
  mk: string;
}
const Calendar = ({ location, index, mk }: p) => {
  const [hours, setHours] = useState<Hours>({
    deliveryHours: [],
    pickupHours: [],
    deliveryExceptions:
      location?.hours?.deliveryExceptions?.map((ex: any) => ({
        ...ex,
        date: new Date(ex.date),
      })) || [],
    pickupExceptions:
      location?.hours?.pickupExceptions?.map((ex: any) => ({
        ...ex,
        date: new Date(ex.date),
      })) || [],
  });
  const [panelStack, setPanelStack] = useState<PanelProps[]>([]);
  const [showModifyButton, setShowModifyButton] = useState(false);
  const modifyButtonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [deliveryPickupMode, setDeliveryPickupMode] =
    useState<DeliveryPickupToggleMode>(() => {
      if (location?.role === UserRole.COOP) {
        return DeliveryPickupToggleMode.PICKUP;
      }
      return DeliveryPickupToggleMode.DELIVERY;
    });
  const [viewEditMode, setViewEditMode] = useState<Mode>(Mode.EDIT);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { open: 540, close: 1020 },
  ]);
  const [isAppendingHours, setIsAppendingHours] = useState(false);

  const [initialSelectionState, setInitialSelectionState] =
    useState<boolean>(false);

  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isBasePanelOpen, setIsBasePanelOpen] = useState(true);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<string | null>(null);
  const selectedDaysCount = Object.values(selectedDays).filter(Boolean).length;
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<
    "select" | "deselect" | null
  >(null);

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
    }
  };

  const handleMouseEnter = (
    day: number | null,
    month: number,
    year: number
  ) => {
    if (isSelecting && day !== null && selectionMode !== null) {
      const key = createDateKey(year, month + 1, day);
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

  const getSelectionDescription = useMemo(() => {
    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString, _]) => parseISO(dateString))
      .filter((date): date is Date => isValid(date))
      .sort((a, b) => a.getTime() - b.getTime());

    if (selectedDates.length === 0) return "";
    if (selectedDates.length === 1)
      return `${
        viewEditMode === Mode.VIEW ? "View" : "Modify"
      } Hours for ${format(selectedDates[0], "MMM d")}`;

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
      return `${
        viewEditMode === Mode.VIEW ? "View" : "Modify"
      } Hours for ${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
    }

    return `${viewEditMode === Mode.VIEW ? "View" : "Modify"} Hours for ${
      selectedDates.length
    } days`;
  }, [selectedDays, viewEditMode]);

  useEffect(() => {
    if (panelStack.length > 0) {
      const updatedPanelStack = panelStack.map((panel) => ({
        ...panel,
        content: renderPanelContent(),
      }));
      setPanelStack(updatedPanelStack);
    }
  }, [getSelectionDescription]);

  useEffect(() => {
    const shouldShowModifyButton =
      selectedDaysCount > 0 && (!isBasePanelOpen || panelStack.length === 0);

    if (shouldShowModifyButton) {
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
  }, [selectedDaysCount, isBasePanelOpen, panelStack.length]);

  const handleClosePanel = () => {
    setPanelStack((prevStack) => prevStack.slice(0, -1));
    if (panelStack.length === 1) {
      setIsBasePanelOpen(false);
    }
  };
  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

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

  const panelSide = windowDimensions.width > 1150;
  const mainContentVariants = {
    open: { width: panelSide ? "calc(100% - 384px)" : "100%" },
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
        height: "336px",
        width: "100%",
      },
      closed: {
        y: "100%",
        height: 0,
        width: "100%",
      },
    },
  };

  const isPanelOpen = panelStack.length > 0;
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (selectedDaysCount === 0) {
      setPanelStack([]); // Close all panels
    } else if (panelSide && selectedDaysCount === 1 && !isPanelOpen) {
      setPanelStack([
        {
          content: renderPanelContent(),
          onClose: () => setPanelStack([]),
        },
      ]);
    }
  }, [selectedDaysCount, panelSide, isPanelOpen]);

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

  const convertMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${mins.toString().padStart(2, "0")}${period}`;
  };

  const selectAllDaysInMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const newSelectedDays: { [key: string]: boolean } = { ...selectedDays };

    let allSelected = true;
    for (let day = 1; day <= daysInMonth; day++) {
      const key = createDateKey(year, month + 1, day);
      if (!newSelectedDays[key]) {
        allSelected = false;
        break;
      }
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = createDateKey(year, month + 1, day);
      newSelectedDays[key] = !allSelected;
    }

    setSelectedDays(newSelectedDays);
  };
  const getCurrentHoursAndExceptions = () => {
    if (deliveryPickupMode === DeliveryPickupToggleMode.DELIVERY) {
      return {
        currentHours: hours.deliveryHours,
        currentExceptions: hours.deliveryExceptions,
      };
    } else {
      return {
        currentHours: hours.pickupHours,
        currentExceptions: hours.pickupExceptions,
      };
    }
  };
  const renderCalendarForMonth = (year: number, month: number): JSX.Element => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const { currentHours, currentExceptions } = getCurrentHoursAndExceptions();

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
        ? currentExceptions.find((ex) => isSameDay(ex.date, currentDate))
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
        data-month={format(new Date(year, month), "MMM yyyy")}
        className="sm:px-1"
      >
        <div
          className="text-2xl font-normal mb-4 px-2 cursor-pointer underline w-fit"
          onClick={() => selectAllDaysInMonth(year, month)}
        >
          {format(new Date(year, month), "MMM yyyy")}
        </div>
        <div className="grid grid-cols-7 w-full gap-px">{calendarDays}</div>
      </div>
    );
  };

  const handleSaveChanges = async () => {
    console.log("Starting handleSaveChanges");
    console.log("Selected days:", selectedDays);
    console.log("Current time slots:", timeSlots);

    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString, _]) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      })
      .filter((date): date is Date => isValid(date))
      .sort((a, b) => a.getTime() - b.getTime());

    console.log("Selected dates:", selectedDates);

    const { currentExceptions } = getCurrentHoursAndExceptions();
    console.log("Current exceptions before update:", currentExceptions);

    const exceptionsMap = new Map(
      currentExceptions.map((exception) => [
        format(new Date(exception.date), "yyyy-MM-dd"),
        {
          ...exception,
          date: new Date(
            Date.UTC(
              exception.date.getUTCFullYear(),
              exception.date.getUTCMonth(),
              exception.date.getUTCDate()
            )
          ),
        },
      ])
    );

    selectedDates.forEach((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      console.log(`Processing date: ${dateKey}`);

      if (isOpen) {
        const newException: StoreException = {
          date,
          timeSlots: [...timeSlots],
        };
        exceptionsMap.set(dateKey, newException);
        console.log(`Updated/Added exception for ${dateKey}`, newException);
      } else {
        exceptionsMap.delete(dateKey);
        console.log(`Removed exception for ${dateKey}`);
      }
    });

    const updatedExceptions = Array.from(exceptionsMap.values());
    console.log("Updated exceptions after processing:", updatedExceptions);

    const updatedHours = {
      ...hours,
      [deliveryPickupMode === DeliveryPickupToggleMode.DELIVERY
        ? "deliveryExceptions"
        : "pickupExceptions"]: updatedExceptions,
    };

    console.log("Final updated hours:", updatedHours);

    setHours(updatedHours);

    try {
      await updateUserHours(updatedHours);
      console.log("Hours updated successfully");
      toast.success("Hours updated successfully");
    } catch (error) {
      console.error("Error updating hours:", error);
      toast.error("Failed to update hours");
    }

    setIsBasePanelOpen(false);
    setSelectedDays({});
    setPanelStack([]);
    setIsAppendingHours(false);
    setTimeSlots([{ open: 540, close: 1020 }]);
    console.log("Finished handleSaveChanges");
  };

  const renderPanelContent = () => (
    <>
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-normal my-4">{getSelectionDescription}</h2>
        {viewEditMode === Mode.VIEW ? (
          <></>
        ) : (
          <>
            {" "}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex justify-center">
                <CustomSwitch
                  isOpen={isOpen}
                  onToggle={() => setIsOpen(!isOpen)}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                setPanelStack((prevStack) => [
                  ...prevStack,
                  {
                    content: renderPanelContent(),
                    onClose: () => setPanelStack((prev) => prev.slice(0, -1)),
                  },
                ]);
              }}
            >
              Add Another Set of Hours
            </Button>
            {timeSlots.map((slot, index) => (
              <div key={index}>
                <TimePicker
                  top={true}
                  value={convertMinutesToTimeString(slot.open)}
                  onChange={(time) => {
                    const newTimeSlots = [...timeSlots];
                    newTimeSlots[index].open = convertTimeStringToMinutes(time);
                    setTimeSlots(newTimeSlots);
                  }}
                  isOpen={isOpen}
                />
                <TimePicker
                  top={false}
                  value={convertMinutesToTimeString(slot.close)}
                  onChange={(time) => {
                    const newTimeSlots = [...timeSlots];
                    newTimeSlots[index].close =
                      convertTimeStringToMinutes(time);
                    setTimeSlots(newTimeSlots);
                  }}
                  isOpen={isOpen}
                />
              </div>
            ))}
            <div className="flex items-center justify-evenly mt-4 space-x-2 w-full">
              <Button className="w-2/5" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button
                className="w-2/5 bg-inherit"
                variant="outline"
                onClick={() => {
                  setPanelStack((prevStack) => prevStack.slice(0, -1));
                  setIsAppendingHours(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderAllMonths = (): JSX.Element[] => {
    const calendarMonths: JSX.Element[] = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(currentDate, i);
      calendarMonths.push(
        renderCalendarForMonth(monthDate.getFullYear(), monthDate.getMonth())
      );
    }

    return calendarMonths;
  };

  const handleDeliveryPickupModeChange = (
    newMode: DeliveryPickupToggleMode
  ) => {
    setDeliveryPickupMode(newMode);
  };

  const handleViewEditModeChange = (newMode: Mode) => {
    setViewEditMode(newMode);
  };
  useEffect(() => {
    if (selectedDaysCount > 0 && !isBasePanelOpen) {
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

  const renderCalendarContent = () => (
    <div className="flex flex-col h-full select-none">
      <div className="sticky top-0 z-40 w-full sheet">
        <div className="flex justify-end items-center gap-px sm:px-3 pt-2 px-0">
          <DeliveryPickupToggle
            panelSide={panelSide}
            onModeChange={handleDeliveryPickupModeChange}
            mode={deliveryPickupMode}
          />
          <div>
            <ViewEditToggle
              panelSide={panelSide}
              mode={viewEditMode}
              onModeChange={handleViewEditModeChange}
            />
          </div>
          {!isBasePanelOpen && (
            <Button
              onClick={() => {
                setIsBasePanelOpen(true);
                setPanelStack([
                  {
                    content: renderPanelContent(),
                    onClose: () => setPanelStack([]),
                  },
                ]);
              }}
              variant="outline"
              className="relative select-none hover:bg-inherit rounded-full flex items-center justify-start bg-inherit ml-1 text-xs mr-2 sm:text-sm px-2 sm:px-4"
            >
              Settings <div className="border-r h-full pl-1" />
              <PiGearThin className="h-5 w-5 sm:h-6 sm:w-6 pl-1" />
            </Button>
          )}
        </div>
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
            onClick={() => {
              setIsBasePanelOpen(true);
              setPanelStack([
                {
                  content: renderPanelContent(),
                  onClose: () => setPanelStack([]),
                },
              ]);
              setShowModifyButton(false);
            }}
          >
            {getSelectionDescription}
          </Button>
        </div>
      )}
    </div>
  );

  const convertMinutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const convertTimeStringToMinutes = (timeString: string): number => {
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (period === "PM" && hours !== 12) totalMinutes += 12 * 60;
    else if (period === "AM" && hours === 12) totalMinutes = 0;
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
    <StackingPanelLayout
      location={location}
      index={index}
      panels={panelStack}
      mainContentVariants={mainContentVariants}
      panelVariants={panelVariants}
      panelSide={panelSide}
      mk={mk}
      isBasePanelOpen={isBasePanelOpen}
      setIsBasePanelOpen={setIsBasePanelOpen}
    >
      {renderCalendarContent()}
    </StackingPanelLayout>
  );
};

export default Calendar;
