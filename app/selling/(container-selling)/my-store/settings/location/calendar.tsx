"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { format, addMonths, isValid, isSameDay, parseISO } from "date-fns";
import { Button } from "@/app/components/ui/button";
import TimePicker from "./time-slot";
import { PanelProps } from "./panel";
import { toast } from "sonner";
import StackingPanelLayout from "./panel";
import {
  DeliveryPickupToggle,
  DeliveryPickupToggleMode,
  Mode,
  ViewEditToggle,
  CustomSwitch,
  CalendarDay,
} from "./helper-components-calendar";
import { PiGearThin } from "react-icons/pi";
import { MonthHours, StoreException, TimeSlot, UserRole } from "@prisma/client";
import {
  checkOverlap,
  convertMinutesToTimeString,
  convertTimeStringToMinutes,
  createDateKey,
  daysOfWeek,
  updateUserHours,
} from "./helper-functions-calendar";

export interface Hours {
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
  const isPanelOpen = panelStack.length > 0;
  const [isOpen, setIsOpen] = useState(true);
  const [userClosedPanel, setUserClosedPanel] = useState(false);
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
  const currentDate = new Date();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isBasePanelOpen, setIsBasePanelOpen] = useState(true);
  const selectedDaysCount = Object.values(selectedDays).filter(Boolean).length;
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<
    "select" | "deselect" | null
  >(null);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[][]>([
    [{ open: 540, close: 1020 }],
  ]);
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

  const mainContentVariants = {
    open: { width: panelSide ? "calc(100% - 384px)" : "100%" },
    closed: { width: "100%" },
  };

  const handleClosePanel = () => {
    setPanelStack((prevStack) => prevStack.slice(0, -1));
    if (panelStack.length === 1 && !panelSide) {
      setIsBasePanelOpen(false);
      setUserClosedPanel(true);
    }
    setShowModifyButton(true);
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

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
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

  const handleTimeSlotChange = (
    panelIndex: number,
    slotIndex: number,
    isOpenTime: boolean,
    newTime: string
  ) => {
    setAllTimeSlots((prevAllTimeSlots) => {
      const newAllTimeSlots = [...prevAllTimeSlots];
      if (!newAllTimeSlots[panelIndex]) {
        newAllTimeSlots[panelIndex] = [];
      }
      const newTimeSlots = [...newAllTimeSlots[panelIndex]];
      const minutes = convertTimeStringToMinutes(newTime);
      if (isOpenTime) {
        newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], open: minutes };
      } else {
        newTimeSlots[slotIndex] = {
          ...newTimeSlots[slotIndex],
          close: minutes,
        };
      }
      newAllTimeSlots[panelIndex] = newTimeSlots;
      return newAllTimeSlots;
    });
  };

  const renderCalendarForMonth = (year: number, month: number): JSX.Element => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const { currentHours, currentExceptions } = getCurrentHoursAndExceptions();

    const calendarDays: JSX.Element[] = [];
    const totalCells = 42;

    const mergeHoursAndExceptions = (date: Date) => {
      const month = date.getMonth();
      const day = date.getDate();

      const monthHours = currentHours.find((mh) => mh.month === month);
      const dayHours = monthHours?.days.find((dh) => dh.day === day);

      const exception = currentExceptions.find((ex) =>
        isSameDay(ex.date, date)
      );

      if (exception && exception.timeSlots) {
        return exception.timeSlots;
      }

      return dayHours?.timeSlots || [];
    };

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const key = isValidDay ? createDateKey(year, month + 1, day) : "";
      const isSelected = isValidDay && !!selectedDays[key];

      const currentDate = isValidDay
        ? new Date(Date.UTC(year, month, day))
        : null;

      const timeSlots = currentDate ? mergeHoursAndExceptions(currentDate) : [];

      calendarDays.push(
        <CalendarDay
          key={`${month}-${i}`}
          day={isValidDay ? day : null}
          onMouseDown={() => handleMouseDown(day, month, year)}
          onMouseEnter={() => handleMouseEnter(day, month, year)}
          isSelected={isSelected}
          timeSlots={timeSlots}
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

  const renderPanelContent = (panelIndex: number) => (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-normal my-4">{getSelectionDescription}</h2>
      {viewEditMode === Mode.VIEW ? (
        <></>
      ) : (
        <>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex justify-center">
              <CustomSwitch
                isOpen={isOpen}
                onToggle={() => setIsOpen((prev) => !prev)}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              if (panelStack.length >= 3) {
                toast.error(
                  "You can only add up to three sets of hours for a day."
                );
                return;
              }
              if (checkOverlap(allTimeSlots)) {
                toast.error(
                  "Cannot add another set of hours because existing time slots overlap."
                );
                return;
              }
              const newPanelIndex = panelStack.length;
              setPanelStack((prevStack) => [
                ...prevStack,
                {
                  content: renderPanelContent(newPanelIndex),
                  onClose: () => {
                    setPanelStack((prev) => prev.slice(0, -1));
                    setAllTimeSlots((prev) => prev.slice(0, -1));
                  },
                },
              ]);
              setAllTimeSlots((prev) => [
                ...prev,
                [{ open: 540, close: 1020 }],
              ]);
            }}
            className="rounded-full my-2 select-none"
          >
            Add Another Set of Hours
          </Button>
          {allTimeSlots[panelIndex]?.map((slot, index) => (
            <div key={index}>
              <TimePicker
                top={true}
                value={convertMinutesToTimeString(slot.open)}
                onChange={(time) =>
                  handleTimeSlotChange(panelIndex, index, true, time)
                }
                isOpen={isOpen}
              />
              <TimePicker
                top={false}
                value={convertMinutesToTimeString(slot.close)}
                onChange={(time) =>
                  handleTimeSlotChange(panelIndex, index, false, time)
                }
                isOpen={isOpen}
              />
            </div>
          ))}
          <div className="flex items-center justify-evenly space-x-2 mt-4 mb-8 w-full">
            <Button className="w-2/5" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button
              className="w-2/5 bg-inherit"
              variant="outline"
              onClick={() => {
                setPanelStack((prevStack) => prevStack.slice(0, -1));
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
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

  const renderCalendarContent = () => (
    <div className="flex flex-col h-full select-none">
      <div className="sticky top-0 z-40 w-full ">
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

          <Button
            onClick={() => {
              setIsBasePanelOpen(!isBasePanelOpen);
              setPanelStack([]);
            }}
            variant="outline"
            className="relative select-none hover:bg-inherit rounded-full flex items-center justify-start bg-inherit ml-1 text-xs mr-2 sm:text-sm px-2 sm:px-4"
          >
            Settings <div className="border-r h-full pl-1" />
            <PiGearThin className="h-5 w-5 sm:h-6 sm:w-6 pl-1" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-px w-full border-b border-gray-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center font-bold p-2"
              // onClick={() => {
              //   const currentMonth = currentDate.getMonth();
              //   const currentYear = currentDate.getFullYear();
              //   selectAllDaysOfWeekInMonth(index, currentYear, currentMonth);
              // }}
            >
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
        style={{ height: "calc(100vh - 150px)" }}
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
                  content: renderPanelContent(0),
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

  useEffect(() => {
    if (panelStack.length > 0) {
      const updatedPanelStack = panelStack.map((panel, index) => ({
        ...panel,
        content: renderPanelContent(index),
      }));
      setPanelStack(updatedPanelStack);
    }
  }, [getSelectionDescription, panelStack.length]);

  useEffect(() => {
    const shouldShowModifyButton =
      selectedDaysCount > 0 && panelStack.length === 0;

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
    if (selectedDaysCount === 0) {
      setPanelStack([]);
      setUserClosedPanel(false);
    } else if (
      panelSide &&
      selectedDaysCount === 1 &&
      !isPanelOpen &&
      !userClosedPanel
    ) {
      setPanelStack([
        {
          content: renderPanelContent(0),
          onClose: () => {
            setPanelStack([]);
            setUserClosedPanel(true);
          },
        },
      ]);
    }
  }, [selectedDaysCount, panelSide, isPanelOpen, userClosedPanel]);

  useEffect(() => {
    if (selectedDaysCount > 1) {
      setUserClosedPanel(false);
    }
  }, [selectedDaysCount]);

  const handleSaveChanges = async () => {
    if (checkOverlap(allTimeSlots)) {
      toast.error("Time slots overlap. Please adjust the hours.");
      return;
    }
    if (index > 2) {
      toast.error("You may only have up to three locations");
      return;
    }
    const selectedDates = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dateString, _]) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      })
      .filter((date): date is Date => isValid(date))
      .sort((a, b) => a.getTime() - b.getTime());

    const { currentExceptions } = getCurrentHoursAndExceptions();

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

      if (isOpen) {
        const newException: StoreException = {
          date,
          timeSlots: allTimeSlots.flat(),
        };
        exceptionsMap.set(dateKey, newException);
      } else {
        exceptionsMap.delete(dateKey);
      }
    });

    const updatedExceptions = Array.from(exceptionsMap.values());

    const updatedHours = {
      ...hours,
      [deliveryPickupMode === DeliveryPickupToggleMode.DELIVERY
        ? "deliveryExceptions"
        : "pickupExceptions"]: updatedExceptions,
    };

    setHours(updatedHours);

    try {
      await updateUserHours(updatedHours, index);
      toast.success("Hours updated successfully");
    } catch (error) {
      console.error("Error updating hours:", error);
      toast.error("Failed to update hours");
    }
    if (!panelSide) {
      setIsBasePanelOpen(false);
    }
    setSelectedDays({});
    setPanelStack([]);
    setAllTimeSlots([[{ open: 540, close: 1020 }]]);
  };

  return (
    <StackingPanelLayout
      location={location}
      index={index}
      panels={panelStack.map((panel, index) => ({
        ...panel,
        content: renderPanelContent(index),
        onClose: () => {
          panel.onClose();
          if (index === panelStack.length - 1 && !panelSide) {
            setIsBasePanelOpen(false);
          }
          handleClosePanel();
        },
      }))}
      mainContentVariants={mainContentVariants}
      panelSide={panelSide}
      mk={mk}
      isBasePanelOpen={isBasePanelOpen}
      setIsBasePanelOpen={setIsBasePanelOpen}
      onPanelClose={handleClosePanel}
    >
      {renderCalendarContent()}
    </StackingPanelLayout>
  );
};

export default Calendar;
