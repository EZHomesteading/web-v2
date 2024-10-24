import React from "react";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
interface SectionLayoutProps {
  /** Main title of the section */
  title?: string;
  /** Array of description lines to be displayed below the title */
  descriptions?: string[];
  /** Main content of the section */
  children: React.ReactNode;
  /** Additional classes for the outer container */
  className?: string;
  /** Override the default max-width for different layouts */
  maxWidth?: string;
  /** Additional classes for the inner container */
  containerClassName?: string;
  /** Optional subtitle below the main title */
  subtitle?: string;
  /** Optional right-aligned content next to the title */
  titleRight?: React.ReactNode;
  /** Whether to center the title */
  centerTitle?: boolean;
}
const OnboardContainer = ({
  title,
  descriptions = [],
  children,
  className = "",
  maxWidth = "sm:max-w-[402.88px]",
  containerClassName = "",
  subtitle,
  titleRight,
  centerTitle = false,
}: SectionLayoutProps) => {
  return (
    <div
      className={`${o.className} flex flex-col justify-start h-full w-full ${className} !select-none`}
    >
      <div className="flex flex-col items-center w-full">
        <div
          className={`w-full max-w-[306.88px] ${maxWidth} ${containerClassName}`}
        >
          {title && (
            <div className="font-medium text-xl flex items-center gap-2">
              {title}
            </div>
          )}
          <div className="mb-6">
            {descriptions.map((description, index) => (
              <div
                key={index}
                className={`text-sm text-gray-500 flex items-center font-normal `}
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
