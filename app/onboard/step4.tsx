import React, { useState, useCallback, useEffect } from "react";
import { LocationObj } from "@/next-auth";
import { Button } from "@/app/components/ui/button";

interface StepFiveProps {
  location?: LocationObj;
  user: any;
  updateFormData: (newData: Partial<{ fulfillmentStyle: string }>) => void;
  formData: string[] | undefined;
}

const StepFour: React.FC<StepFiveProps> = ({
  user,
  updateFormData,
  formData,
  location,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const options = [
    "Delivery Only",
    "Pickup Only",
    "Set Delivery Hours And then Set Pickup Hours",
    "Set the same Hours for Deliveries and Pickups",
  ];
  const setFulfillmentStyle = (index: number) => {
    switch (index) {
      case 0:
        updateFormData({ fulfillmentStyle: "delivery" });
        break;
      case 1:
        updateFormData({ fulfillmentStyle: "pickup" });
        break;
      case 2:
        updateFormData({ fulfillmentStyle: "bothone" });
        break;
      case 3:
        updateFormData({ fulfillmentStyle: "both" });
        break;
      default:
        console.log("Invalid index");
    }
    console.log();
  };
  return (
    <div className="h-full w-full p-8 flex flex-col  items-center">
      <div className=" mb-4 text-center items-center  pt-[2%] sm:pt-[5%] text-4xl">
        Select Order Fulfilment style for{" "}
        {formData?.[0] || location?.address?.[0] || "Your Location"}
      </div>

      <div className="text-center py-[1%] sm:py-[1%] text-2xl">
        Select Whether this location will be Delivery only, Pickup only, or
        Both.
      </div>
      <div className="text-center py-[1%] sm:py-[1%] text-2xl">
        We are working on DoorDash integration. In the future, locations With
        delivery enabled will be able to outsource deliveries to DoorDash
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => {
              setSelectedOption(option);
              setFulfillmentStyle(index);
            }}
            className={`p-2 px-20 border-[2px] text-2xl rounded ${
              selectedOption.includes(option)
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepFour;
