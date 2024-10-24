import React, { useCallback, useEffect, useState, useRef } from "react";
import { LocationObj } from "@/next-auth";
import { Hours } from "@prisma/client";

interface StepSevenProps {
  location?: LocationObj;
  formData: string[] | undefined;
  updateFormData: (
    newData: Partial<{ selectedMonths: number[]; hours: Hours }>
  ) => void;
  resetHoursData: (
    hours: Hours,
    newType: "both" | "delivery" | "pickup"
  ) => void;
  selectedMonths: number[] | undefined;
  onDayChange: (selectedDays: string[]) => void;
  onFinish: (hours: Hours, type: string) => void;
  fulfillmentStyle?: string;
}

const StepEight: React.FC<StepSevenProps> = ({
  location,
  formData,
  updateFormData,
  selectedMonths,
  onDayChange,
  onFinish,
  fulfillmentStyle,
  resetHoursData,
}) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [openMonths, setOpenMonths] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [svgScale, setSvgScale] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (selectedMonths && selectedMonths.length > 0) {
      setOpenMonths(selectedMonths);
    }
  }, [selectedMonths]);

  const toggleMonth = useCallback((monthIndex: number) => {
    setOpenMonths((prevMonths) => {
      const newMonths = prevMonths.includes(monthIndex)
        ? prevMonths.filter((m) => m !== monthIndex)
        : [...prevMonths, monthIndex];
      return newMonths;
    });
  }, []);

  const handleMouseDown = (monthIndex: number) => {
    setIsDragging(true);
    toggleMonth(monthIndex);
  };

  const handleMouseEnter = (monthIndex: number) => {
    if (isDragging) {
      toggleMonth(monthIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    updateFormData({
      selectedMonths: openMonths,
    });
  }, [openMonths, updateFormData]);

  const formatHour = (hour: number) => {
    if (hour === 0 || hour === 24) return "12 AM";
    if (hour === 12) return "Noon";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const handleDayClick = (day: string) => {
    onDayChange([day]);
  };

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const scale = containerWidth / 700; // 700 is our base SVG width
        setSvgScale(scale);

        // Set font size, but don't let it go below 16px (text-md equivalent)
        const calculatedFontSize = Math.max(48, 48 * scale);
        setFontSize(calculatedFontSize);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const generateHoursData = useCallback(
    (type: string) => {
      if (!selectedMonths || !location?.hours) {
        console.error("Missing required data for generating hours");
        return null;
      }

      const hours: Hours = {
        delivery: [],
        pickup: [],
      };

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      selectedMonths.forEach((monthIndex) => {
        // Determine which year to use for this month
        const monthToProcess = new Date(currentYear, monthIndex, 1);
        const useNextYear = monthToProcess < currentDate;
        const yearToUse = useNextYear ? currentYear + 1 : currentYear;

        const daysInMonth = new Date(yearToUse, monthIndex + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const dateToCheck = new Date(yearToUse, monthIndex, day);
          const currentDayDate = new Date(currentYear, monthIndex, day);

          // For current month, add both current and next year schedules for remaining days
          if (monthIndex === currentDate.getMonth()) {
            if (currentDayDate < currentDate) {
              // Past days in current month - only add next year
              addScheduleForDate(new Date(currentYear + 1, monthIndex, day));
            } else {
              // Remaining days in current month - add both years
              addScheduleForDate(new Date(currentYear, monthIndex, day));
              addScheduleForDate(new Date(currentYear + 1, monthIndex, day));
            }
          } else if (useNextYear) {
            // Past months - only add next year
            addScheduleForDate(dateToCheck);
          } else {
            // Future months - only add current year
            addScheduleForDate(dateToCheck);
          }
        }
      });

      // Helper function to add schedule for a specific date
      function addScheduleForDate(date: Date) {
        const dayOfWeek = date.getDay();
        const schedules = location?.hours?.pickup || [];
        const daySchedule = schedules.find(
          (schedule) =>
            weekDays[dayOfWeek] ===
            schedule.date.toLocaleString("en-US", { weekday: "long" })
        );

        if (daySchedule && daySchedule.timeSlots.length > 0) {
          const timeSlots = daySchedule.timeSlots.map((slot) => ({
            open: slot.open,
            close: slot.close,
          }));

          const dailySchedule = {
            date,
            timeSlots,
            capacity: 0,
          };

          if (type === "delivery") {
            hours.delivery.push(dailySchedule);
          } else if (type === "pickup") {
            hours.pickup.push(dailySchedule);
          } else if (type === "both") {
            hours.pickup.push(dailySchedule);
            hours.delivery.push(dailySchedule);
          }
        }
      }

      // Sort the arrays by date to ensure chronological order
      hours.delivery.sort((a, b) => a.date.getTime() - b.date.getTime());
      hours.pickup.sort((a, b) => a.date.getTime() - b.date.getTime());

      return hours;
    },
    [selectedMonths, location?.hours, weekDays, fulfillmentStyle]
  );
  const handleFinish = () => {
    const hoursData = generateHoursData(fulfillmentStyle ?? "pickup");
    if (hoursData) {
      onFinish(hoursData, fulfillmentStyle ?? "pickup");
    }
  };

  const handleFinishBoth = (type: "both" | "delivery" | "pickup") => {
    const hoursData = generateHoursData(type);
    if (hoursData) {
      if (type === "both") {
        updateFormData({
          selectedMonths,
          hours: hoursData,
        });
        onFinish(hoursData, type);
      } else {
        updateFormData({ selectedMonths, hours: hoursData });
        resetHoursData(hoursData, type);
      }
    }
  };
  const renderWeeklyScheduleGraph = () => {
    const viewBoxWidth = 700;
    const viewBoxHeight = 450;
    const padding = 50;
    const titleHeight = 50;
    const buttonHeight = 30;
    const bottomSpacing = 10;
    const graphTop = titleHeight;
    const graphHeight =
      viewBoxHeight - graphTop - padding - buttonHeight - bottomSpacing;
    const dayWidth = (viewBoxWidth - padding * 2) / 7;
    const hourHeight = graphHeight / 8;

    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width={viewBoxWidth}
        height={viewBoxHeight}
        style={{ transform: `scale(${svgScale})`, transformOrigin: "top left" }}
      >
        <rect
          x={0}
          y={0}
          width={viewBoxWidth}
          height={420}
          fill="black"
          rx={10}
          ry={10}
        />

        {/* Title and Subtitle */}
        <text
          x={viewBoxWidth / 2}
          y={20}
          textAnchor="middle"
          fill="white"
          fontSize={fontSize * 1.25}
          fontWeight="bold"
        >
          Weekly Hours For Selected Months
        </text>
        <text
          x={viewBoxWidth / 2}
          y={40}
          textAnchor="middle"
          fill="white"
          fontSize={fontSize * 0.8}
        >
          Click a day to edit hours
        </text>

        {/* Grid lines */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`vline-${i}`}
            x1={padding + i * dayWidth}
            y1={graphTop}
            x2={padding + i * dayWidth}
            y2={graphTop + graphHeight}
            stroke="white"
            strokeOpacity="0.2"
          />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={`hline-${i}`}
            x1={padding}
            y1={graphTop + i * hourHeight}
            x2={viewBoxWidth - padding}
            y2={graphTop + i * hourHeight}
            stroke="white"
            strokeOpacity="0.2"
          />
        ))}

        {/* Thicker axis lines */}
        <line
          x1={padding}
          y1={graphTop}
          x2={padding}
          y2={graphTop + graphHeight}
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={graphTop + graphHeight}
          x2={viewBoxWidth - padding}
          y2={graphTop + graphHeight}
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={graphTop}
          x2={viewBoxWidth - padding}
          y2={graphTop}
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1={viewBoxWidth - padding}
          y1={graphTop}
          x2={viewBoxWidth - padding}
          y2={graphTop + graphHeight}
          stroke="white"
          strokeWidth="2"
        />

        {/* X-axis (days) - now styled as buttons and positioned relative to graph */}
        {weekDays.map((day, index) => (
          <g
            key={day}
            onClick={() => handleDayClick(day)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={padding + index * dayWidth + 2}
              y={graphTop + graphHeight + bottomSpacing}
              width={dayWidth - 4}
              height={buttonHeight}
              fill="green"
              rx={5}
              ry={5}
              filter="url(#button-shadow)"
            />
            <text
              x={padding + index * dayWidth + dayWidth / 2}
              y={graphTop + graphHeight + bottomSpacing + buttonHeight / 2}
              textAnchor="middle"
              fill="white"
              fontSize={fontSize * 0.8}
              dominantBaseline="middle"
            >
              {day.slice(0, 3)}
            </text>
          </g>
        ))}

        {/* Y-axis (hours) */}
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour, index) => (
          <text
            key={hour}
            x={padding - 5}
            y={graphTop + index * hourHeight}
            textAnchor="end"
            fill="white"
            fontSize={fontSize * 0.8}
            dominantBaseline="middle"
          >
            {formatHour(hour)}
          </text>
        ))}

        {/* Time slots */}
        {location?.hours?.pickup.map((pickup) => {
          const dayIndex = pickup.date.getDay();
          return pickup.timeSlots.map((slot, slotIndex) => {
            const startHour = Math.floor(slot.open / 60);
            const endHour = Math.ceil(slot.close / 60);
            const startY = graphTop + (startHour / 3) * hourHeight;
            const height = ((endHour - startHour) / 3) * hourHeight;
            return (
              <rect
                key={`${dayIndex}-${slotIndex}`}
                x={padding + dayIndex * dayWidth + 2}
                y={startY}
                width={dayWidth - 4}
                height={height}
                fill="green"
                opacity="0.7"
                rx={5}
                ry={5}
              />
            );
          });
        })}
      </svg>
    );
  };
  return (
    <div className="h-[100%]  sm:px-8 ">
      <h1 className="text-3xl font-bold mb-2 pt-6 text-center">
        Review Your{" "}
        {fulfillmentStyle === "delivery"
          ? "Delivery "
          : fulfillmentStyle === "pickup"
          ? "Pickup"
          : fulfillmentStyle === "bothone"
          ? "Delivery"
          : fulfillmentStyle === "both"
          ? "Delivery and Pickup"
          : null}{" "}
        Schedule for{" "}
        {formData?.[0] || location?.address?.[0] || "Your Location"}
      </h1>
      <h2 className="text-xl font-semibold mb-4  text-center">
        You will be able to edit specific days later in settings
      </h2>
      <h2 className="text-xl font-semibold mt-4  text-center">
        Months you will have this schedule for.
      </h2>
      <h2 className="text-xl font-semibold text-center">
        Click a Month to add or remove it from your schedule.
      </h2>
      <div className=" rounded-lg px-0 sm:px-8 pt-6 pb-8  mb-10">
        <div className="flex flex-col items-center ">
          <div
            className="grid grid-cols-4 gap-2"
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            {months.map((month, index) => (
              <button
                key={month}
                onMouseDown={() => handleMouseDown(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`p-6 text-sm border-[2px] rounded-md ${
                  openMonths.includes(index)
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
        <div
          className="flex pt-5 justify-center"
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          {renderWeeklyScheduleGraph()}
        </div>

        {fulfillmentStyle === "both" ? (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => handleFinishBoth("both")}
              className="px-4 py-2 bg-green-500  text-white rounded hover:bg-green-600"
            >
              Save hours for Both Delivery and Pickup
            </button>
          </div>
        ) : fulfillmentStyle === "bothone" ? (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => handleFinishBoth("delivery")}
              className="px-4 py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
            >
              Save these hours for Delivery and set diffenent Pickup hours
            </button>
          </div>
        ) : (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-green-500  text-white rounded hover:bg-green-600"
            >
              Save Hours
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepEight;
