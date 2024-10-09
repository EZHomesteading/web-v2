import React, { useMemo } from "react";

interface CalendarDayProps {
  day: number | null;
  isLastInRow: boolean;
  isLastRow: boolean;
  onMouseDown: (day: number | null) => void;
  onMouseEnter: (day: number | null) => void;
  isSelected: boolean;
  exceptionTimes: string | null;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isLastInRow,
  isLastRow,
  onMouseDown,
  onMouseEnter,
  isSelected,
  exceptionTimes,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (day !== null) {
      e.preventDefault();
      onMouseDown(day);
    }
  };

  const handleMouseEnter = () => {
    if (day !== null) {
      onMouseEnter(day);
    }
  };

  // Determine animation settings based on the time range
  const animationSettings = useMemo(() => {
    if (!exceptionTimes)
      return {
        shouldAnimate: false,
        startColor: "black",
        endColor: "black",
        duration: "5s",
      };

    const [openTime, closeTime] = exceptionTimes.split("-").map((time) => {
      const [hoursStr, minutesPeriod] = time.match(/\d+:\d+|\w+/g) || [];
      if (!hoursStr || !minutesPeriod) return 0;

      const [hourStr, minuteStr] = hoursStr.split(":");
      const period = minutesPeriod.toUpperCase();
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    });

    if (typeof openTime !== "number" || typeof closeTime !== "number")
      return {
        shouldAnimate: false,
        startColor: "black",
        endColor: "black",
        duration: "5s",
      };

    const totalMinutesOpen = closeTime - openTime;
    const maxAnimationDuration = 30; // Maximum animation time in seconds
    const animationDuration =
      Math.min((totalMinutesOpen / 60) * 2, maxAnimationDuration) + "s";

    // Determine starting and ending colors based on open and close times
    const startColor =
      openTime < 6 * 60
        ? "black" // Before 6 AM
        : openTime < 8 * 60
        ? "#FF8C00" // 6-8 AM: Sunrise
        : openTime < 12 * 60
        ? "#FFFF00" // 8 AM - 12 PM: Morning light
        : openTime < 16 * 60
        ? "#FFD700" // 12-4 PM: Peak sun
        : openTime < 18 * 60
        ? "#FFA500" // 4-6 PM: Afternoon light
        : openTime < 20 * 60
        ? "#FF4500" // 6-8 PM: Sunset
        : "black"; // 8 PM onwards

    const endColor =
      closeTime < 6 * 60
        ? "black" // Before 6 AM
        : closeTime < 8 * 60
        ? "#FF8C00" // 6-8 AM: Sunrise
        : closeTime < 12 * 60
        ? "#FFFF00" // 8 AM - 12 PM: Morning light
        : closeTime < 16 * 60
        ? "#FFD700" // 12-4 PM: Peak sun
        : closeTime < 18 * 60
        ? "#FFA500" // 4-6 PM: Afternoon light
        : closeTime < 20 * 60
        ? "#FF4500" // 6-8 PM: Sunset
        : "black"; // 8 PM onwards

    return {
      shouldAnimate: true,
      startColor,
      endColor,
      duration: animationDuration,
    };
  }, [exceptionTimes]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      className={`
        ${day !== null ? "border border-gray-200 h-36 cursor-pointer" : "h-12"}
        ${isLastInRow ? "border-r-0" : ""}
        ${isLastRow ? "border-b-0" : ""}
        ${isSelected && day !== null ? "bg-emerald-200 border-none" : ""}
        relative
      `}
    >
      {day !== null && (
        <div className="p-2">
          <div
            className={`text-sm font-light ${
              isSelected ? "underline" : !exceptionTimes ? "line-through" : ""
            }`}
          >
            {day}
          </div>
          {exceptionTimes && (
            <div
              className={`text-[.5rem] sm:text-xs mt-1 overflow-y-auto ${
                animationSettings.shouldAnimate ? "daylight-animation" : ""
              }`}
              style={{
                animation: animationSettings.shouldAnimate
                  ? `daylightGradient ${animationSettings.duration} linear forwards`
                  : "none",
                "--start-color": animationSettings.startColor,
                "--end-color": animationSettings.endColor,
              }}
            >
              {exceptionTimes}
            </div>
          )}
        </div>
      )}
      {isSelected && day !== null && (
        <div className="absolute inset-0 bg-slate-700 opacity-50 pointer-events-none"></div>
      )}
    </div>
  );
};

export default CalendarDay;
