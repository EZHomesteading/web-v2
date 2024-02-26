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
        max-w-[2520px] 
        mx-auto 
        xl:px-20 
        md:px-10 
        sm:px-2 
        px-4 
      "
    >
      {children}
    </div>
  );
};

export default Container;
