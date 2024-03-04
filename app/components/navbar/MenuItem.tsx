"use client";

import { useTheme } from "next-themes";

// Define props interface for MenuItem component
interface MenuItemProps {
  // Function to handle click event
  onClick: () => void;
  // Label for the menu item
  label: string;
}

// MenuItem component
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "bg-black" : "bg-white";

  return (
    // Render the menu item with click event and styling
    <div
      onClick={onClick}
      className={`
        px-4 
        py-3 
        hover:bg-neutral-100 
        font-semibold
        ${backgroundColor}       
        `}
    >
      {label}
    </div>
  );
};

// Export the MenuItem component
export default MenuItem;
