"use client";

// Importing necessary modules and components
import { IconType } from "react-icons";

// Interface defining props accepted by the CategoryView component
interface CategoryViewProps {
  icon: IconType; // Icon for the category
  label: string; // Label for the category
  description: string; // Description for the category
}

// CategoryView component
const CategoryView: React.FC<CategoryViewProps> = ({
  icon: Icon, // Icon for the category received as prop
  label, // Label for the category received as prop
  description, // Description for the category received as prop
}) => {
  return (
    <div className="flex flex-col gap-6">
      {" "}
      {/* Container for category view */}
      <div className="flex flex-row items-center gap-4">
        {" "}
        {/* Container for icon, label, and description */}
        <Icon size={40} className="text-neutral-600" /> {/* Icon */}
        <div className="flex flex-col">
          {" "}
          {/* Container for label and description */}
          <div
            className="text-lg font-semibold" // Styling for label
          >
            {label} {/* Label */}
          </div>
          <div
            className="text-neutral-500 font-light" // Styling for description
          >
            {description} {/* Description */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView; // Exporting CategoryView component
