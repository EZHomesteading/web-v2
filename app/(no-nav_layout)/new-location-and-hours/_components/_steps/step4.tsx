import React, { useEffect, useState } from "react";
import {
  PiArrowsCounterClockwiseThin,
  PiCalendarBlankThin,
  PiCarProfileThin,
  PiStorefrontThin,
} from "react-icons/pi";
import { OutfitFont, ZillaFont } from "@/components/fonts";

import OnboardContainer from "../onboard.container";

interface StepFiveProps {
  user: any;
  updateFormData: (newData: Partial<{ fulfillmentStyle: string }>) => void;
  formData: string | undefined;
  fStyle?: string;
}

const StepFour: React.FC<StepFiveProps> = ({
  updateFormData,
  formData,
  fStyle = "",
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(fStyle); // Initialize with fStyle
  const [fulfillmentStyle, setFulfillmentStyle] = useState<string>(fStyle);

  // Sync selectedOption with the initial fStyle
  useEffect(() => {
    setSelectedOption(fStyle);
  }, [fStyle]);
  const options = [
    {
      label: "Unique Delivery & Pickup Hours",
      icon: <PiCalendarBlankThin size={24} />,
      description: [
        "Deliver or pickup depending on date and time",
        "Most common and recommended option",
      ],
      value: "bothone",
    },
    {
      label: "Pickup Only",
      icon: <PiStorefrontThin size={24} />,
      description: [
        "All purchases and sales happen at this location",
        "Best for sellers who never want to deliver",
      ],
      value: "pickup",
    },
    {
      label: "Delivery Only",
      icon: <PiCarProfileThin size={24} />,
      description: [
        "All purchases and sales handled via delivery",
        "Best for sellers who don't want visitors at this address",
      ],
      value: "delivery",
    },

    {
      label: "Set the Same Hours for Both",
      icon: <PiArrowsCounterClockwiseThin size={24} />,
      description: [
        "Use identical hours for delivery and pickup.",
        "Best for locations able to manage deliveries and on-site orders at the same times",
      ],
      value: "both",
    },
  ];
  const changeStyle = (index: number) => {
    const selectedStyle = options[index].value;
    setFulfillmentStyle(selectedStyle);
    setSelectedOption(selectedStyle); // Update selected option
    updateFormData({ fulfillmentStyle: selectedStyle }); // Sync with form data
  };

  return (
    <OnboardContainer
      title="Set Location Mode"
      descriptions={[
        "How would you like to fufill orders?",
        "Fine-tune your daily schedule later in settings",
      ]}
    >
      <div className="grid grid-cols-1 gap-2">
        {options.map((option: any, index: number) => (
          <button
            key={option.label}
            onClick={() => {
              setSelectedOption(option.label);
              changeStyle(index);
            }}
            className={`${
              OutfitFont.className
            } flex flex-col items-justify-start text-start p-4 w-full max-w-[306.88px] sm:min-w-[402.88px] rounded-xl min-h-[134px]  border transition ${
              selectedOption == option.value
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
              option.description.map((line: string, idx: number) => (
                <p
                  key={idx}
                  className={` ${
                    selectedOption.includes(option.label) && " text-white"
                  } mt-2 text-sm text-neutral-600 ${ZillaFont.className} `}
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
    </OnboardContainer>
  );
};

export default StepFour;
