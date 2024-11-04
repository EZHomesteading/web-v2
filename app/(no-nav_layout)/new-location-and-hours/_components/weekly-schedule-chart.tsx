import { LocationObj } from "location-types";
import { useEffect, useRef } from "react";

interface p {
  location?: LocationObj;
  handleDayClick?: any;
  showSubTitle?: boolean;
  bgColor?: string;
  fontColors?: string;
  barColor?: string;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  title?: string;
  editHours?: boolean;
}

const WeelkyScheduleChart = ({
  location,
  title = "Weekly Schedule",
  handleDayClick,
  showSubTitle = false,
  bgColor = "#fff",
  fontColors = "#000",
  barColor = "#fff",
  viewBoxHeight = 450,
  viewBoxWidth = 700,
  editHours = true,
}: p) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const padding = 50;
  const titleHeight = 50;
  const buttonHeight = 40;
  const bottomSpacing = 15;
  const graphTop = titleHeight;
  const graphHeight =
    viewBoxHeight - graphTop - padding - buttonHeight - bottomSpacing;
  const dayWidth = (viewBoxWidth - padding * 2) / 7;
  const hourHeight = graphHeight / 8;
  const baseFontSize = Math.min(viewBoxWidth, viewBoxHeight) * 0.025; // 2.5% of smallest viewBox dimension
  const titleFontSize = baseFontSize * 1.4;
  const subtitleFontSize = baseFontSize * 0.8;
  const dayLabelFontSize = baseFontSize * 0.75;
  const hourLabelFontSize = baseFontSize * 0.7;
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const scaleX = containerWidth / viewBoxWidth;
        const scaleY = containerHeight / viewBoxHeight;

        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = viewBoxWidth * scale;
        const scaledHeight = viewBoxHeight * scale;

        if (svgRef.current) {
          svgRef.current.style.width = `${scaledWidth}px`;
          svgRef.current.style.height = `${scaledHeight}px`;
          svgRef.current.style.transform = "none";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, [viewBoxWidth, viewBoxHeight]);
  const getDayNameFromSlot = (dayIndex: number) => {
    return weekDays[dayIndex];
  };
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-start justify-center"
      style={{ minHeight: "450px" }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* gradient for inside */}
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="#f4f4f5" />{" "}
            {/*#cbd5e1 #94a3b8 #64748b #475569 */}
            <stop offset="49%" stopColor="#d9b759" />
            <stop offset="51%" stopColor="#d9b759" />
            <stop offset="80%" stopColor="#f4f4f5" /> {/**/}
          </linearGradient>
          <filter id="dropShadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* main black background */}
        <rect
          x={0}
          y={0}
          width={viewBoxWidth}
          height={viewBoxHeight}
          fill={bgColor}
          rx={15}
          ry={15}
        />

        {/* applies gradient background for grid area only */}
        <rect
          x={padding}
          y={graphTop}
          width={viewBoxWidth - padding * 2}
          height={graphHeight}
          fill="url(#bgGradient)"
          rx={4}
          ry={4}
        />

        {/* title and subtitle */}
        <text
          x={viewBoxWidth / 2}
          y={25}
          textAnchor="middle"
          fill={fontColors}
          fontSize={titleFontSize}
          fontWeight="medium"
        >
          {title}
        </text>
        {showSubTitle && (
          <text
            x={viewBoxWidth / 2}
            y={40}
            textAnchor="middle"
            fill="gray"
            fontSize={subtitleFontSize}
            fontWeight="medium"
          >
            Click on Day of the Week to Modify
          </text>
        )}

        {/* grid lines */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`vline-${i}`}
            x1={padding + i * dayWidth}
            y1={graphTop}
            x2={padding + i * dayWidth}
            y2={graphTop + graphHeight}
            stroke="#404040"
            strokeWidth="1"
          />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={`hline-${i}`}
            x1={padding}
            y1={graphTop + i * hourHeight}
            x2={viewBoxWidth - padding}
            y2={graphTop + i * hourHeight}
            stroke="#404040"
            strokeWidth="1"
          />
        ))}

        {/* grid border */}
        <rect
          x={padding}
          y={graphTop}
          width={viewBoxWidth - padding * 2}
          height={graphHeight}
          fill="none"
          stroke="#525252"
          strokeWidth="1"
          rx={4}
          ry={4}
        />

        {/* days of week at the bottom */}
        {weekDays.map((day, index) => (
          <g
            key={day}
            onClick={() => handleDayClick(day)}
            style={{ cursor: "pointer" }}
          >
            <text
              x={padding + index * dayWidth + dayWidth / 2}
              y={graphTop + graphHeight + bottomSpacing + buttonHeight / 2}
              textAnchor="middle"
              fill={fontColors}
              fontSize={dayLabelFontSize}
              dominantBaseline="middle"
              className={`font-light underline`}
            >
              {day.slice(0, 3)}
            </text>
          </g>
        ))}

        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour, index) => (
          <text
            key={hour}
            x={padding - 10}
            y={graphTop + index * hourHeight}
            textAnchor="end"
            fill={fontColors}
            fontSize={hourLabelFontSize}
            dominantBaseline="middle"
          >
            {formatHour(hour)}
          </text>
        ))}

        {/*time slot rects*/}
        {location?.hours?.pickup.map(
          (pickup: { date: { getDay: () => any }; timeSlots: any[] }) => {
            const dayIndex = pickup.date.getDay();
            const dayName = getDayNameFromSlot(dayIndex);

            return pickup.timeSlots.map((slot, slotIndex) => {
              const startHour = Math.floor(slot.open / 60);
              const endHour = Math.ceil(slot.close / 60);
              const startY = graphTop + (startHour / 3) * hourHeight;
              const height = ((endHour - startHour) / 3) * hourHeight;

              return (
                <g key={`${dayIndex}-${slotIndex}`}>
                  <rect
                    x={padding + dayIndex * dayWidth + 4}
                    y={startY}
                    width={dayWidth - 8}
                    height={height}
                    opacity={0.95}
                    fill={barColor}
                    rx={6}
                    ry={6}
                    filter="url(#dropShadow)"
                    onClick={() => handleDayClick(dayName)}
                  />
                  {editHours && (
                    <rect
                      x={padding + dayIndex * dayWidth + 4}
                      y={startY}
                      width={dayWidth - 8}
                      height={height}
                      fill="transparent"
                      rx={6}
                      ry={6}
                      className="hover:fill-black hover:opacity-50"
                      onClick={() => handleDayClick(dayName)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </g>
              );
            });
          }
        )}
      </svg>
    </div>
  );
};
const formatHour = (hour: number) => {
  if (hour === 0 || hour === 24) return "12 AM";
  if (hour === 12) return "Noon";
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};
export default WeelkyScheduleChart;
