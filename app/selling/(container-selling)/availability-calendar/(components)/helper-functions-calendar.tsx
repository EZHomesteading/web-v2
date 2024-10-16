import axios from "axios";
import { Hours } from "./(components)/calendar";
import { TimeSlot } from "@prisma/client";

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

const createDateKey = (year: number, month: number, day: number): string => {
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};

const updateUserHours = async (updatedHours: Hours) => {
  try {
    await axios.post("/api/useractions/update/location-hours", {
      location: [
        {
          ...location,
          hours: updatedHours,
        },
      ],
    });
  } catch (error) {
    console.error("Error updating hours:", error);
  }
};

const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  daysOfWeek,
  checkOverlap,
  panelVariants,
};
