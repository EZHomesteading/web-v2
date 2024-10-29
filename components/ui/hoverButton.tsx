import React, { DOMAttributes, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  buttonText: string;
  hoverMessage: string;
}

export const HoverButton = ({ buttonText, hoverMessage }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {buttonText}
      </Button>
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
          {hoverMessage}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};
