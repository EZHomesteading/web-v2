import React, { useState, useCallback, useEffect } from "react";
import { LocationObj } from "@/next-auth";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import {
  PiArrowsCounterClockwiseThin,
  PiCalendarBlankThin,
  PiCarProfileThin,
  PiStorefrontThin,
} from "react-icons/pi";
import OnboardHeader from "./header.onboard";

interface StepFiveProps {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: Partial<{ fulfillmentStyle: string }>) => void;
  formData: string[] | undefined;
  fStyle?: string;
}

const StepFour: React.FC<StepFiveProps> = ({
  updateFormData,
  formData,
  location,
  fStyle = "",
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [index, setIndex] = useState<number>();
  const options = [
    {
      label: "Unique Delivery & Pickup Hours",
      icon: <PiCalendarBlankThin size={24} />,
      description: [
        "Deliver or pickup depending on date and time",
        "Most common and recommended option",
      ],
    },
    {
      label: "Pickup Only",
      icon: <PiStorefrontThin size={24} />,
      description: [
        "All purchases and sales happen at this location",
        "Best for sellers who never want to deliver",
      ],
    },
    {
      label: "Delivery Only",
      icon: <PiCarProfileThin size={24} />,
      description: [
        "All purchases and sales handled via delivery",
        "Best for sellers who don't want visitors at this address",
      ],
    },

    {
      label: "Set the Same Hours for Both",
      icon: <PiArrowsCounterClockwiseThin size={24} />,
      description: [
        "Use identical hours for delivery and pickup.",
        "Best for locations able to manage deliveries and on-site orders at the same times",
      ],
    },
  ];
  const [fulfillmentStyle, setFulfillmentStyle] = useState<string>(fStyle);
  const changeStyle = (index: number) => {
    let style: string = fulfillmentStyle;
    switch (index) {
      case 0:
        style = "???";
        break;
      case 1:
        style = "pickup";
        break;
      case 2:
        style = "delivery";
        break;
      case 3:
        style = "both";
        break;
      default:
        console.log("Invalid index");
    }
    setFulfillmentStyle(style);
    updateFormData({ fulfillmentStyle: style });
  };

  return (
    <div
      className={`${o.className} flex flex-col justify-start pt-2 sm:pt-[5%] h-full w-full `}
    >
      <div className="flex flex-col items-center w-full ">
        <div className="w-full max-w-[306.88px] sm:max-w-[402.88px] mt-4 mb-6">
          <div className="font-medium text-xl flex items-center gap-2">
            Set Location Mode
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            How would you like to fufill orders
          </div>
          <div className="text-sm text-gray-500 flex items-center font-normal">
            Fine-tune your daily schedule later in settings
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols- gap-2">
          {options.map((option, index) => (
            <button
              key={option.label}
              onClick={() => {
                setSelectedOption(option.label);
                changeStyle(index);
                setIndex(index);
              }}
              className={`${
                o.className
              } flex flex-col items-justify-start text-start p-4 w-full max-w-[306.88px] sm:max-w-[402.88px] rounded-xl min-h-[134px] sm:h-fit border transition ${
                selectedOption.includes(option.label)
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className="flex items-center space-x-2">
                {option.icon}
                <span className="text-md sm:text-lg font-semibold">
                  {option.label}
                </span>
              </div>
              {Array.isArray(option.description) ? (
                option.description.map((line, idx) => (
                  <p
                    key={idx}
                    className={` ${
                      selectedOption.includes(option.label) && " text-white"
                    } mt-2 text-sm text-neutral-600 `}
                  >
                    {line}
                  </p>
                ))
              ) : (
                <p className="mt-2 text-sm">{option.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepFour;
