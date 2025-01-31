import React from "react";

interface WheelProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  isHourWheel?: boolean;
  disabledOptions?: string[];
}

const Wheel: React.FC<WheelProps> = ({
  options,
  selectedValue,
  onSelect,
  isOpen,
  isHourWheel = false,
  disabledOptions = [],
}) => {
  const isDisabled = (option: string) => {
    return disabledOptions.includes(option);
  };

  return (
    <div className="flex flex-col w-20 overflow-y-auto scrollbar-hide">
      {options.map((option) => {
        const disabled = isDisabled(option);

        return (
          <button
            key={option}
            onClick={() => {
              if (!disabled && isOpen) {
                onSelect(option);
              }
            }}
            disabled={disabled || !isOpen}
            className={`
              py-2 px-4 text-center transition-colors relative
              ${
                selectedValue === option
                  ? disabled
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }
              ${!isOpen && "cursor-not-allowed opacity-50"}
              ${disabled ? "opacity-50 cursor-not-allowed text-gray-400" : ""}
              ${disabled && selectedValue === option ? "bg-gray-100" : ""}
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default Wheel;
