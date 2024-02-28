"use client";
// Import necessary dependencies and interfaces
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import { useTheme } from "next-themes";
// Define the CategoryBoxProps interface
interface CategoryBoxProps {
  icon: IconType; // Icon component type
  label: string; // Category label
  selected?: boolean; // Flag to indicate if the category is selected
}

// CategoryBox component
const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  // Initialize router and search params hook
  const router = useRouter();
  const params = useSearchParams();
  const { theme } = useTheme();

  // Handle click event
  const handleClick = useCallback(() => {
    let currentQuery = {};

    // Parse current search params
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    // Update query params with selected category
    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    // Remove category from query params if already selected
    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    // Construct new URL with updated query params
    const url = qs.stringifyUrl(
      {
        url: "/shop",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    // Navigate to the new URL
    router.push(url);
  }, [label, router, params]);

  const baseStyles = `
  flex 
  flex-col 
  items-center 
  justify-center 
  gap-2
  p-3
  border-b-2
  transition
  cursor-pointer
`;

  const themeStyles =
    theme === "dark"
      ? "text-neutral-200 hover:text-neutral-100"
      : "text-neutral-700 hover:text-neutral-900";
  const selectedStyles = selected
    ? "border-b-neutral-800 dark:border-b-neutral-200"
    : "border-transparent";

  return (
    // Render the category box element with conditional styles based on props
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col 
        items-center 
        justify-center 
        gap-2
        p-3
        border-b-2
        hover:text-neutral-800
        transition
        cursor-pointer
        ${selected ? "border-b-neutral-800" : "border-transparent"}
        ${selected ? "text-neutral-800" : "text-neutral-500"}
      `}
    >
      {/* Render the icon */}
      <Icon size={26} />
      {/* Render the category label */}
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
