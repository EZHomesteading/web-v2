"use client";
// Import necessary dependencies and interfaces
import { IconType } from "react-icons";

// Define the ButtonProps interface
interface ButtonProps {
  label: string; // Button label
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Click event handler
  disabled?: boolean; // Flag to disable the button
  outline?: boolean; // Flag to render an outlined button
  small?: boolean; // Flag to render a small-sized button
  icon?: IconType; // Icon component type
}

// Button component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon, // Destructure props
}) => {
  return (
    // Render the button element with conditional class names based on props
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        ${outline ? "bg-white" : "bg-rose-500"}
        ${outline ? "border-black" : "border-rose-500"}
        ${outline ? "text-black" : "text-white"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "py-1" : "py-3"}
        ${small ? "font-light" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
      `}
    >
      {/* Render the icon if provided */}
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      {/* Render the button label */}
      {label}
    </button>
  );
};

export default Button;
