"use client";

import React from "react";

// Define props interface for the Container component
interface ContainerProps {
  children: React.ReactNode; // Child components to be wrapped by the container
}

// Container component
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    // Container div with responsive padding and maximum width
    <div
      className="
        max-w-[2520px] // Maximum width for larger screens
        mx-auto // Center align the container horizontally
        xl:px-20 // Padding for extra-large screens
        md:px-10 // Padding for medium screens
        sm:px-2 // Padding for small screens
        px-4 // Default padding
      "
    >
      {children} // Render the children components inside the container
    </div>
  );
};

export default Container;
