"use client";
//onboarding page
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { UserInfo } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import StepOne from "./step1";
import StepTwo from "./step2";
import StepThree from "./step3";
import StepFour from "./step4";
import StepSix from "./step6";
import StepFive from "./step5";
import StepSeven from "./step7";
import StepEight from "./step8";
import StepNine from "./step9";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  user: UserInfo;
  index: number;
  apiKey?: string;
}

interface LocationObj {
  type: string;
  coordinates: number[];
  address: string[];
  hours?: ExtendedHours;
}

interface UserLocation {
  [key: number]: LocationObj | null;
}

const Onboarding = ({ user, index, apiKey }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(index);
  const [formData, setFormData] = useState<{
    hours?: ExtendedHours;
    image?: string;
    bio?: string;
    location?: UserLocation;
  }>({});

  const [progress, setProgress] = useState(0);

  const handleNext = async () => {
    try {
      if (step === 3 || step === 4) {
        const existingLocations: UserLocation =
          (user.location as UserLocation) || {};
        let updatedLocations: UserLocation;

        if (step === 3) {
          updatedLocations = {
            0: {
              ...formData.location?.[0],
              hours:
                formData.location?.[0]?.hours ||
                existingLocations[0]?.hours ||
                null,
            } as LocationObj,
            ...Object.fromEntries(
              Object.entries(existingLocations)
                .filter(([key, value]) => key !== "0" && value !== null)
                .map(([key, value]) => [Number(key), value])
            ),
          };
        } else {
          // step === 4
          updatedLocations = {
            ...existingLocations,
            0: {
              ...(existingLocations[0] || {}),
              hours: formData.location?.[0]?.hours || null,
            } as LocationObj,
          };
        }

        await axios.post("/api/useractions/update", {
          location: updatedLocations,
        });
      } else if (step === 6) {
        if (formData.image) {
          await axios.post("/api/useractions/update", {
            image: formData.image,
          });
        }
      } else if (step === 7) {
        if (formData.bio) {
          await axios.post("/api/useractions/update", { bio: formData.bio });
        }
      } else if (step === 9) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(`Error updating data for step ${step}:`, error);
    }

    setStep(step + 1);
    setProgress((step + 1) * 11);
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setProgress((step - 1) * 11);
  };

  useEffect(() => {
    if (step === 1) {
      setProgress(0);
    } else {
      setProgress(step * 11);
    }
  }, [step]);

  const updateFormData = useCallback((newData: Partial<typeof formData>) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      if (newData.location) {
        updatedData.location = {
          ...prevData.location,
          ...newData.location,
        };
      }
      return updatedData;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto !overflow-x-hidden mt-10 md:mt-0">
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && apiKey && (
          <StepThree
            user={user}
            apiKey={apiKey}
            updateFormData={updateFormData}
          />
        )}
        {step === 4 && <StepFour user={user} updateFormData={updateFormData} />}
        {step === 5 && <StepFive />}
        {step === 6 && (
          <StepSix
            userImage={formData.image || user?.image}
            updateFormData={updateFormData}
          />
        )}
        {step === 7 && (
          <StepSeven userBio={user?.bio} updateFormData={updateFormData} />
        )}
        {step === 8 && <StepEight />}
        {step === 9 && <StepNine user={user} />}
      </div>
      <div>
        <Progress value={progress} className="w-full mb-4" />

        {step === 1 ? (
          <div className="flex justify-end px-4 pb-4">
            <Button onClick={handleNext}>Next</Button>
          </div>
        ) : (
          <div className="flex justify-between px-4 pb-4">
            {step > 1 && (
              <Button onClick={handlePrevious} variant="outline">
                Back
              </Button>
            )}
            {step < 9 && <Button onClick={handleNext}>Next</Button>}
            {step === 9 && <Button onClick={handleNext}>Finish</Button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
