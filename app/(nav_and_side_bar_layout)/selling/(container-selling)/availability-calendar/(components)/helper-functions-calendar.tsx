import axios from "axios";
import { Availability, Hours } from "@prisma/client";
import { TimeSlot } from "@prisma/client";
import { isThisYear, format, parseISO } from "date-fns";

const convertMinutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};

const week_day_mmm_dd_yy_time = (
  minutes: number,
  date: Date
): { time: string; date: Date } => {
  const combinedDateTime = new Date(date.getTime() + minutes * 60000);

  const hours = combinedDateTime.getHours();
  const mins = combinedDateTime.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const timeString = `${formattedHours}:${mins
    .toString()
    .padStart(2, "0")}${period}`;

  const dateFormat = isThisYear(combinedDateTime)
    ? "EEE, MMM d"
    : "EEE, MMM d yyyy";
  const dateString = format(combinedDateTime, dateFormat);

  return { time: `${dateString} at ${timeString}`, date: combinedDateTime };
};
function formatDateToMMMDDAtHourMin(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  return format(date, "MMM d 'at' h:mma");
}
const hasAvailableHours = (hours: Availability[] | null): boolean => {
  if (!hours) return false;

  return !!hours && hours.length > 0;
};

const convertTimeStringToMinutes = (timeString: string): number => {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;
  if (period === "PM" && hours !== 12) totalMinutes += 12 * 60;
  else if (period === "AM" && hours === 12) totalMinutes = 0;
  return totalMinutes;
};
type DateSelection = {
  [key: string]: boolean;
};

const convertSelectedDayToDate = (
  selectedDay: DateSelection,
  time: number
): { state_date: Date; state_time: number } | null => {
  const dateKey = Object.keys(selectedDay)[0];

  if (!dateKey) {
    return null;
  }

  const date = parseISO(dateKey);

  return {
    state_date: date,
    state_time: time,
  };
};
const createDateKey = (year: number, month: number, day: number): string => {
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};

const updateUserHours = async (updatedHours: Hours, locationId?: string) => {
  try {
    await axios.post("/api/useractions/update/location-hours", {
      locationId: locationId,
      hours: updatedHours,
    });
  } catch (error) {
    console.error("Error updating hours:", error);
  }
};

const daysOfWeek: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const checkOverlap = (slots: TimeSlot[][]): boolean => {
  const flatSlots = slots.flat().sort((a, b) => a.open - b.open);
  for (let i = 0; i < flatSlots.length; i++) {
    if (flatSlots[i].close < flatSlots[i].open) {
      return true;
    }
  }
  for (let i = 0; i < flatSlots.length - 1; i++) {
    if (flatSlots[i].close >= flatSlots[i + 1].open) {
      return true;
    }
  }
  return false;
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

export {
  convertMinutesToTimeString,
  convertTimeStringToMinutes,
  updateUserHours,
  createDateKey,
  hasAvailableHours,
  daysOfWeek,
  checkOverlap,
  week_day_mmm_dd_yy_time,
  panelVariants,
  formatDateToMMMDDAtHourMin,
  convertSelectedDayToDate,
};
export type { DateSelection };
