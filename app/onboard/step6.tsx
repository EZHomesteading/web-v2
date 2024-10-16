import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import SliderSelection from "@/app/selling/(container-selling)/my-store/settings/slider-selection";
import { useRef, useMemo } from "react";
import { format, addMonths, isValid, isSameDay, parseISO } from "date-fns";
import { Button } from "@/app/components/ui/button";
import TimePicker from "@/app/selling/(container-selling)/availability-calendar/(components)/time-slot";
import { toast } from "sonner";
import StackingPanelLayout, {
  PanelProps,
} from "@/app/selling/(container-selling)/availability-calendar/(components)/panel";
import {
  DeliveryPickupToggle,
  DeliveryPickupToggleMode,
  Mode,
  CustomSwitch,
  CalendarDay,
} from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { PiGearThin } from "react-icons/pi";
import { MonthHours, UserRole } from "@prisma/client";
import {
  checkOverlap,
  convertMinutesToTimeString,
  convertTimeStringToMinutes,
  createDateKey,
  daysOfWeek,
  updateUserHours,
} from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { LocationObj } from "@/next-auth";

type TimeSlot = {
  open: number;
  close: number;
};

type StoreException = {
  date: Date;
  timeSlots?: TimeSlot[];
};
export interface Hours {
  deliveryHours: MonthHours[];
  pickupHours: MonthHours[];
  deliveryExceptions: StoreException[];
  pickupExceptions: StoreException[];
}

interface p {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: Partial<{ location: any }>) => void;
  formData: string[] | undefined;
  setOpenMonths: Dispatch<SetStateAction<string[]>>;
}

const StepSix = ({
  user,
  updateFormData,
  // setOpenMonths,
  formData,
  location,
}: p) => {
  const [newLocation, setNewLocation] = useState(user?.location?.[0] || null);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDaysChange = (newDays: any) => {
    let updatedLocation = { ...location, hours: newDays };
    setNewLocation(updatedLocation);
    updateFormData({ location: { 0: updatedLocation } });
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleMonth = useCallback((days: string) => {
    setOpenDays((prevDays) => {
      const newDays = prevDays.includes(days)
        ? prevDays.filter((d) => d !== days)
        : [...prevDays, days];
      return newDays;
    });
  }, []);

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
  const handleSaveChanges = async () => {
    if (checkOverlap(allTimeSlots)) {
      toast.error("Time slots overlap. Please adjust the hours.");
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

      const newException: StoreException = {
        date,
        timeSlots: isOpen ? allTimeSlots.flat() : undefined,
      };
      exceptionsMap.set(dateKey, newException);
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
      await updateUserHours(updatedHours, id);
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
  const renderPanelContent = (panelIndex: number) => (
    <div className="h-full">
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Set Up Your Store Hours for{" "}
        {formData && formData[0]
          ? `${formData[0]}`
          : user.locations
          ? user.locations[1].address[1]
          : "no location set"}
      </div>
      <div className="text-center pt-[1%] sm:pt-[1%] text-2xl">
        Select Days of the week that will have the same hours.
      </div>

      <div className="flex flex-col items-center sm:mt-[3%] mt-[3%]">
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
            {panelIndex > 0 && (
              <Button
                className="w-2/5 bg-inherit"
                variant="outline"
                onClick={() => {
                  setPanelStack((prevStack) => prevStack.slice(0, -1));
                  setAllTimeSlots((prev) => prev.slice(0, -1));
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </>
      </div>
    </div>
  );

  return (
    <div>
      <StackingPanelLayout panels={panelStack} />
    </div>
  );
};

export default StepSix;
