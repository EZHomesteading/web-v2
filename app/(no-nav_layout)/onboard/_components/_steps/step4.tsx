import React, { useState } from "react";
import {
  PiArrowsCounterClockwiseThin,
  PiCalendarBlankThin,
  PiCarProfileThin,
  PiStorefrontThin,
} from "react-icons/pi";
import { outfitFont } from "@/components/fonts";
import OnboardContainer from "../onboard.container";
import { z } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";

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
  console.log(formData);
  const [selectedOption, setSelectedOption] = useState("");
  const [index, setIndex] = useState<number>();
  let options: any = null;
  if (formData === "PRODUCER") {
    options = [
      {
        label: "Delivery Only",
        icon: <PiCarProfileThin size={24} />,
        description: [
          "All purchases and sales handled via delivery",
          "Best for sellers who don't want visitors at this address",
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
        label: "Set the Same Hours for Both",
        icon: <PiArrowsCounterClockwiseThin size={24} />,
        description: [
          "Use identical hours for delivery and pickup.",
          "Best for locations able to manage deliveries and on-site orders at the same times",
        ],
      },
      {
        label: "Unique Delivery & Pickup Hours",
        icon: <PiCalendarBlankThin size={24} />,
        description: [
          "Deliver or pickup depending on date and time",
          "Most common and recommended option",
        ],
      },
    ];
  } else {
    options = [
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
      {
        label: "Unique Delivery & Pickup Hours",
        icon: <PiCalendarBlankThin size={24} />,
        description: [
          "Deliver or pickup depending on date and time",
          "Most common and recommended option",
        ],
      },
    ];
  }
  const [fulfillmentStyle, setFulfillmentStyle] = useState<string>(fStyle);
  const changeStyle = (index: number) => {
    let style: string = fulfillmentStyle;
    if (formData === "PRODUCER") {
      switch (index) {
        case 0:
          style = "delivery";
          break;
        case 1:
          style = "pickup";
          break;
        case 2:
          style = "both";
          break;
        case 3:
          style = "bothone";
          break;
        default:
          console.log("Invalid index");
      }
    } else {
      switch (index) {
        case 0:
          style = "pickup";

          break;
        case 1:
          style = "delivery";
          break;
        case 2:
          style = "both";
          break;
        case 3:
          style = "bothone";
          break;
        default:
          console.log("Invalid index");
      }
    }
    setFulfillmentStyle(style);
    updateFormData({ fulfillmentStyle: style });
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
              setIndex(index);
            }}
            className={`${
              outfitFont.className
            } flex flex-col items-justify-start text-start p-4 w-full max-w-[306.88px] sm:min-w-[402.88px] rounded-xl min-h-[134px]  border transition ${
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
              option.description.map((line: string, idx: number) => (
                <p
                  key={idx}
                  className={` ${
                    selectedOption.includes(option.label) && " text-white"
                  } mt-2 text-sm text-neutral-600 ${z.className} `}
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
