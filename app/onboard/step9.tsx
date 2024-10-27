import React, { useCallback, useEffect, useState, useRef } from "react";
import { LocationObj } from "@/next-auth";
import { Hours } from "@prisma/client";
import { useRouter } from "next/navigation";

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
  locationId?: string;
  onFinish: (hours: Hours, type: string) => void;

  fulfillmentStyle?: string;
}

const StepNine: React.FC<StepSevenProps> = ({
  location,
  formData,
  updateFormData,
  selectedMonths,
  onDayChange,
  locationId,
  fulfillmentStyle,
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
  const router = useRouter();
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

      <div className=" rounded-lg px-0 sm:px-8 pt-6 pb-8  mb-10">
        <div className="flex flex-col items-center ">
          <div className="grid grid-cols-4 gap-2">
            {months.map((month, index) => (
              <div
                key={month}
                className={`p-6 text-sm border-[2px] rounded-md ${
                  openMonths.includes(index)
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {month}
              </div>
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

        <div className="absolute bottom-4 right-4">
          <button
            onClick={() =>
              router.push(`/selling/availability-calendar/${locationId}`)
            }
            className="px-4 mr-2 py-2 bg-green-500  text-white rounded hover:bg-green-600"
          >
            Set Vacation days on Full Calendar
          </button>
          <button
            onClick={() => router.push(`/create?id=${locationId}`)}
            className="px-4 py-2 bg-green-500  text-white rounded hover:bg-green-600"
          >
            Create a Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepNine;
