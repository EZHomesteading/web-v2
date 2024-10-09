import React, { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface WheelProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isHourWheel?: boolean;
}

const ITEM_HEIGHT = 40;

const Wheel: React.FC<WheelProps> = ({
  options,
  selectedValue,
  onSelect,
  isHourWheel = false,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isScrolling = useRef<boolean>(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (wheelRef.current) {
      const index = options.indexOf(selectedValue);
      wheelRef.current.scrollTop = index * ITEM_HEIGHT;
    }
  }, [selectedValue, options]);

  const handleScroll = () => {
    if (wheelRef.current) {
      isScrolling.current = true;
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const { scrollTop } = wheelRef.current!;
        const totalHeight = options.length * ITEM_HEIGHT;

        let adjustedScrollTop = scrollTop % totalHeight;
        if (adjustedScrollTop < 0) {
          adjustedScrollTop += totalHeight;
        }

        const rawIndex = adjustedScrollTop / ITEM_HEIGHT;
        const index = Math.round(rawIndex) % options.length;

        wheelRef.current!.scrollTop = index * ITEM_HEIGHT;
        onSelect(options[index]);
        isScrolling.current = false;
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      navigateOption(e.key === "ArrowUp" ? -1 : 1);
    }
  };

  const navigateOption = (direction: number) => {
    const currentIndex = options.indexOf(selectedValue);
    const newIndex =
      (currentIndex + direction + options.length) % options.length;
    onSelect(options[newIndex]);
  };

  const renderOptions = () => {
    return options.map((option, index) => {
      const diff = index - options.indexOf(selectedValue);
      const maxDiff = 2;
      const adjustedDiff = Math.max(-maxDiff, Math.min(diff, maxDiff));

      const rotateX = adjustedDiff * 25;
      const opacity = Math.max(0, 1 - Math.abs(adjustedDiff) * 0.3);
      const scale = adjustedDiff === 0 ? 1 : 0.8;

      return (
        <div
          key={`${option}-${index}`}
          className="flex items-center justify-center text-xl text-black transition-all duration-200"
          style={{
            transform: `rotateX(${rotateX}deg) scale(${scale})`,
            opacity: opacity,
            height: `${ITEM_HEIGHT}px`,
            lineHeight: `${ITEM_HEIGHT}px`,
            transformOrigin: "center center",
          }}
        >
          {option}
        </div>
      );
    });
  };

  return (
    <div
      className={`relative h-full w-24 overflow-hidden shadow-md border rounded-xl ${
        isFocused ? "shadow-lg" : ""
      }`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 flex flex-col items-center overflow-y-auto scrollbar-hide"
        ref={wheelRef}
        onScroll={handleScroll}
        style={{
          overflowY: "scroll",
          scrollBehavior: "smooth",
          scrollSnapType: "y mandatory",
          paddingTop: `${ITEM_HEIGHT * 2}px`,
          paddingBottom: `${ITEM_HEIGHT * 2}px`,
        }}
      >
        {renderOptions()}
      </div>
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-full">
        <div className="absolute top-1/2 left-0 right-0 h-[40px] -translate-y-1/2 border-t border-b border-gray-300"></div>
      </div>
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center">
        <button
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => navigateOption(-1)}
          aria-label="Previous option"
        >
          <ChevronUp size={16} />
        </button>
        <button
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => navigateOption(1)}
          aria-label="Next option"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default Wheel;
