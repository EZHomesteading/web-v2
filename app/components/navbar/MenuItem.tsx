"use client";

// Define props interface for MenuItem component
interface MenuItemProps {
  // Function to handle click event
  onClick: () => void;
  // Label for the menu item
  label: string;
}

// MenuItem component
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    // Render the menu item with click event and styling
    <div
      onClick={onClick}
      className="
        px-4 
        py-3 
        hover:bg-neutral-100 
        font-semibold
      "
    >
      {/* Display the label */}
      {label}
    </div>
  );
};

// Export the MenuItem component
export default MenuItem;
