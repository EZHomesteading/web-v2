"use client";
// Import necessary dependencies and interfaces
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";

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
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    // Navigate to the new URL
    router.push(url);
  }, [label, router, params]);

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
