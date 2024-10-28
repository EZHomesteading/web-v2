import React from "react";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { Zilla_Slab } from "next/font/google";
interface SectionLayoutProps {
  title?: string;
  descriptions?: string[];
  children?: React.ReactNode;
  className?: string;
  maxWidth?: string;
  containerClassName?: string;
  subtitle?: string;
  titleRight?: React.ReactNode;
  centerTitle?: boolean;
}
export const zillaFont = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});
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
      className={`${o.className} flex flex-col justify-start h-full w-full ${className} !select-none mb-6`}
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
                className={`${zillaFont.className} text-sm text-gray-500 flex items-center font-normal `}
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
