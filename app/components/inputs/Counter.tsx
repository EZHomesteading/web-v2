"use client";

// Importing the necessary modules and components
import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

// Interface defining props accepted by the Counter component
interface CounterProps {
  title: string; // Title for the counter
  subtitle: string; // Subtitle for the counter
  value: number; // Current value of the counter
  onChange: (value: number) => void; // Function to handle value change
}

// Counter component
const Counter: React.FC<CounterProps> = ({
  title, // Title received as prop
  subtitle, // Subtitle received as prop
  value, // Current value received as prop
  onChange, // Function to handle value change received as prop
}) => {
  // Function to handle addition of value
  const onAdd = useCallback(() => {
    onChange(value + 1); // Incrementing value by 1 and calling onChange function
  }, [onChange, value]); // Dependency array includes onChange and value

  // Function to handle reduction of value
  const onReduce = useCallback(() => {
    if (value === 0) {
      return; // If value is already 1, do nothing
    }

    onChange(value - 1); // Decrementing value by 1 and calling onChange function
  }, [onChange, value]); // Dependency array includes onChange and value

  // Rendering the Counter component
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div> {/* Rendering the title */}
        <div className="font-light text-gray-600">
          {subtitle} {/* Rendering the subtitle */}
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        {/* Button to reduce value */}
        <div
          onClick={onReduce} // Handling click event by invoking onReduce function
          className="
            w-10
            h-10
            rounded-full
            border-[1px]
            flex
            items-center
            justify-center
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          <AiOutlineMinus /> {/* Minus icon */}
        </div>
        {/* Displaying the current value */}
        <div
          className="
            font-light 
            text-xl 
          "
        >
          {value}
        </div>
        {/* Button to add value */}
        <div
          onClick={onAdd} // Handling click event by invoking onAdd function
          className="
            w-10
            h-10
            rounded-full
            border-[1px]
            flex
            items-center
            justify-center
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          <AiOutlinePlus /> {/* Plus icon */}
        </div>
      </div>
    </div>
  );
};

export default Counter; // Exporting Counter component
