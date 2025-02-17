import React from "react";
import { OutfitFont, ZillaFont } from "@/components/fonts";

interface SectionLayoutProps {
  title?: string;
  descriptions?: string[];
  children?: React.ReactNode;
  className?: string;
  maxWidth?: string;
  containerClassName?: string;
}

const OnboardContainer = ({
  title,
  descriptions = [],
  children,
  className = "",
  maxWidth = "sm:max-w-[402.88px]",
  containerClassName = "",
}: SectionLayoutProps) => {
  return (
    <div
      className={`${OutfitFont.className} flex flex-col justify-start h-full w-full !select-none mb-6 ${className}`}
    >
      <div className="flex flex-col items-center w-full ">
        <div
          className={`w-full max-w-[306.88px] ${maxWidth} ${containerClassName}`}
        >
          {title && (
            <div className="font-medium text-xl flex items-center gap-2">
              {title}
            </div>
          )}
          <div className="mb-3">
            {descriptions.map((description, index) => (
              <div
                key={index}
                className={`${ZillaFont.className} text-sm text-gray-500 flex items-center font-normal `}
              >
                {description}
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardContainer;
