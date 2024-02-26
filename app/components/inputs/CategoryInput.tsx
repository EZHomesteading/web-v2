"use client";

// Importing necessary types from react-icons library
import { IconType } from "react-icons";

// Interface defining props accepted by the CategoryBox component
interface CategoryBoxProps {
  icon: IconType; // Icon component for rendering icon
  label: string; // Label for the category
  selected?: boolean; // Optional prop indicating if the category is selected
  onClick: (value: string) => void; // Function to handle click event
}

// CategoryBox component
const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon, // Icon component received as prop
  label, // Label received as prop
  selected, // Optional prop indicating if the category is selected
  onClick, // Function to handle click event received as prop
}) => {
  return (
    <div
      onClick={() => onClick(label)} // Handling click event by invoking onClick function with label
      className={`
        rounded-xl
        border-2
        p-4
        flex
        flex-col
        gap-3
        hover:border-black
        transition
        cursor-pointer
        ${selected ? "border-black" : "border-neutral-200"}
      `}
    >
      {/* Rendering the Icon component with size 30 */}
      <Icon size={30} />
      <div className="font-semibold">
        {/* Rendering the category label */}
        {label}
      </div>
    </div>
  );
};

export default CategoryBox; // Exporting CategoryBox component
