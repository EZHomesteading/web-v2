"use client";

import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  style?: any;
}

const Container: React.FC<ContainerProps> = ({ style, children }) => {
  return (
    <div
      className="
        min-w-screen 
        mx-auto 
        xl:px-20 
        md:px-10 
        sm:px-2 
        px-4 
      "
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
