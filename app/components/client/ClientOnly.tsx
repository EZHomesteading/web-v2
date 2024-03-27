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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
};

export default ClientOnly;
