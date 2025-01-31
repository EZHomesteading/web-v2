// utils.tsx
import { OptimalRoute, RouteResult } from "./types";

export const formatTime = (minutes: number, date?: Date): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  let timeStr = `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;

  if (date) {
    timeStr += ` on ${date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })}`;
  }

  return timeStr;
};
export const secondsToInputTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

const secondsToTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

const metersToMiles = (meters: number): number => {
  return meters * 0.000621371;
};
const formatAddress = (address: string[]): string => {
  return address.join(", ");
};
