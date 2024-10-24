import { UserInfo } from "@/next-auth";
import { UserRole } from "@prisma/client";
import axios from "axios";
import { GiFruitTree } from "react-icons/gi";
import { IoStorefrontOutline } from "react-icons/io5";
import { toast } from "sonner";
import { o } from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { useState } from "react";
import OnboardContainer from "./onboard.container";

interface p {
  user: UserInfo;
  updateFormData: (data: Partial<{ role: UserRole }>) => void;
}

const StepTwo = ({ user, updateFormData }: p) => {
  const options = [
    {
      label: "Co-Op Location",
      icon: <IoStorefrontOutline size={24} />,
      description: [
        "Sell directly to anyone",
        "Recommended for market stand owners looking to expand",
        "Greater time commitment but greater rewards",
      ],
    },
    {
      label: "Grower Location",
      icon: <GiFruitTree size={24} />,
      description: [
        "Sell in larger quantities only to Co-Ops",
        "Ideal for bulk sellers preferring minimal buyer interaction",
        " Lower time commitment with moderate returns", // can be rephrased
      ],
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const Producer = async () => {
    updateFormData({ role: "PRODUCER" });
    if ((user.role = "CONSUMER") || (user.role = "PRODUCER")) {
      try {
        await axios.post("/api/useractions/update", {
          role: "PRODUCER",
          hasPickedRole: null,
        });
      } catch (error) {
      } finally {
        toast.success("Role Updated to Grower");
        updateFormData({ role: "PRODUCER" });
      }
    }
  };
  const Coop = async () => {
    updateFormData({ role: "COOP" });
    if (
      (user.role = "CONSUMER") ||
      (user.role = "PRODUCER") ||
      (user.role = "COOP")
    ) {
      try {
        await axios.post("/api/useractions/update", {
          role: "COOP",
          hasPickedRole: null,
        });
      } catch (error) {
      } finally {
        toast.success("Role Updated to Co-op");
        updateFormData({ role: "COOP" });
      }
    }
  };
  return (
    <OnboardContainer
      title="Select Role For This Selling Location"
      descriptions={[
        "Users with atleast one Co-Op location can purchase from Growers",
        "You may change location types at any time",
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols- gap-2">
        {options.map((option, index) => (
          <button
            key={option.label}
            onClick={() => {
              index === 1 ? Producer() : Coop();
              setSelectedIndex(index);
            }}
            className={`${
              o.className
            } flex flex-col items-justify-start text-start p-4 w-full max-w-[306.88px] sm:max-w-[402.88px] rounded-xl min-h-[134px] sm:h-fit border transition ${
              selectedIndex === index
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
                    selectedIndex === index && " text-white"
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
    </OnboardContainer>
  );
};

export default StepTwo;
