"use client";

import { useTheme } from "next-themes";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "bg-black" : "bg-white";

  return (
    <div
      onClick={onClick}
      className={`
        px-4 
        py-3 
        hover:bg-neutral-100 
        font-semibold
        text-sm
        flex
        items-center
        ${backgroundColor}       
        `}
    >
      <div className="mr-2">{icon}</div>
      {label}
    </div>
  );
};

export default MenuItem;
