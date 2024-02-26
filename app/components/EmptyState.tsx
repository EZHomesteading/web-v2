"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Importing useRouter hook from next/navigation
import Button from "./Button"; // Importing Button component
import Heading from "./Heading"; // Importing Heading component

// Define props interface for the EmptyState component
interface EmptyStateProps {
  title?: string; // Title for the empty state, default value is "No exact matches"
  subtitle?: string; // Subtitle for the empty state, default value is "Try changing or removing some of your filters."
  showReset?: boolean; // Boolean flag to show or hide the reset button, default is true
}

// EmptyState component
const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches", // Default title for the empty state
  subtitle = "Try changing or removing some of your filters.", // Default subtitle for the empty state
  showReset, // Flag to determine whether to show the reset button or not
}) => {
  const router = useRouter(); // Get the router instance

  return (
    <div
      className="
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
      "
    >
      {/* Heading component with title and subtitle */}
      <Heading
        center // Center align the heading
        title={title} // Title of the empty state
        subtitle={subtitle} // Subtitle of the empty state
      />
      {/* Conditional rendering of the reset button based on the showReset prop */}
      <div className="w-48 mt-4">
        {showReset && ( // Show the reset button only if showReset is true
          <Button
            outline // Use outline style for the button
            label="Remove all filters" // Button label
            onClick={() => router.push("/")} // onClick event handler to reset filters and navigate back to the default route
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
