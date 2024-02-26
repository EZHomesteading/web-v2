"use client";

import React, { useState, useEffect } from "react";

// Define props interface for the ClientOnly component
interface ClientOnlyProps {
  children: React.ReactNode; // Child components to be rendered conditionally
}

// ClientOnly component
const ClientOnly: React.FC<ClientOnlyProps> = ({
  children, // Destructure children from props
}) => {
  // State to track whether the component has mounted
  const [hasMounted, setHasMounted] = useState(false);

  // Effect hook to set hasMounted to true when component mounts
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render children only after the component has mounted
  if (!hasMounted) return null;

  return (
    // Return the children components
    <>{children}</>
  );
};

export default ClientOnly;
