import React from "react";

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
            <div className="text-[.5rem] sm:text-xs mt-1 text-emerald-700">
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
