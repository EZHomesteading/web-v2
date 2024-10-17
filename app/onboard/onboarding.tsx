"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { LocationObj, UserInfo } from "@/next-auth";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { useRouter } from "next/navigation";
import StepOne from "./step1";
import StepTwo from "./step2";
import StepThree from "./step3";
import StepFour from "./step4";
import StepFive from "./step5";
import StepSix from "./step6";
import StepSeven from "./step7";
import { Session } from "next-auth";
import { HoverButton } from "../components/ui/hoverButton";
import { Location, UserRole } from "@prisma/client";
import { toast } from "sonner";

interface Props {
  user: UserInfo;
  index: number;
  apiKey: string;
  // canReceivePayouts: boolean | null;
  // session: Session;
  locations: Location[] | null;
}

const Onboarding = ({ user: initialUser, index, apiKey, locations }: Props) => {
  const router = useRouter();
  // console.log("locations", locations);
  const [step, setStep] = useState(locations?.length !== 0 ? 2 : index);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [user, setUser] = useState<UserInfo>(initialUser);
  const [formData, setFormData] = useState<{
    locationId?: string;
    role?: UserRole;
    image?: string;
    bio?: string;
    location?: LocationObj;
    selectedMonths?: number[];
  }>({});
  const [progress, setProgress] = useState(0);

  const updateFormData = useCallback(
    (newData: Partial<{ location: LocationObj }>) => {
      setFormData((prevData) => {
        if (
          newData.location &&
          JSON.stringify(prevData.location) === JSON.stringify(newData.location)
        ) {
          return prevData; // No change, return the same object
        }
        return {
          ...prevData,
          ...newData,
        };
      });
    },
    []
  );
  useEffect(() => {}, [formData.location]);
  const updateFormDataMonths = useCallback(
    (newData: Partial<{ selectedMonths: number[] }>) => {
      setFormData((prevData) => {
        if (
          newData.selectedMonths &&
          JSON.stringify(prevData.selectedMonths) ===
            JSON.stringify(newData.selectedMonths)
        ) {
          return prevData; // No change, return the same object
        }
        return {
          ...prevData,
          ...newData,
        };
      });
    },
    []
  );
  const updateFormDataRole = useCallback(
    (newData: Partial<{ role: UserRole }>) => {
      setFormData((prevData) => ({
        ...prevData,
        ...newData,
      }));
    },
    []
  );

  const handleNext = async () => {
    try {
      if (step === 3 && !formData.locationId) {
        if (formData.location) {
          const response = await axios.post(
            "/api/useractions/update/location-hours",
            {
              location: [formData.location],
            }
          );
          console.log("LULULULULU", response.data.id);
          setFormData({
            locationId: response.data.id,
            location: formData.location,
          });
          setUser((prevUser) => ({
            ...prevUser,
            location: response.data || formData.location,
          }));
        }
      } else if (step === 6 && formData.locationId) {
        // Save the updated hours
        if (formData.location?.hours) {
          setUser((prevUser) => ({
            ...prevUser,
            location: formData.location,
          }));
        }
        setStep((prevStep) => prevStep - 1);
        return;
      } else if (step === 7) {
        // Final step, redirect to create page
        router.push("/create");
        return;
      }
      console.log(formData.location);
      setStep((prevStep) => prevStep + 1);
      setProgress((prevProgress) => prevProgress + 14.28); // 100 / 7 steps
    } catch (error) {
      console.error(`Error updating data for step ${step}:`, error);
      toast.error("An error occurred while saving your data.");
    }
  };

  const handlePrevious = () => {
    if (step === 7) {
      setStep(5);
      return;
    }
    setStep((prevStep) => prevStep - 1);
    setProgress((prevProgress) => prevProgress - 14.28); // 100 / 7 steps
  };
  const handleStep5Complete = (days: string[]) => {
    console.log(days);
    console.log(formData.selectedMonths);
    console.log(formData.location);
    setSelectedDays(days);
    setStep(6);
  };
  const handleCompleteHours = () => {
    console.log(formData.selectedMonths);
    console.log(formData.location);
    setStep(7);
  };
  const handleStep6Back = () => {
    setStep(5);
  };

  const handleStep6Complete = () => {
    setStep(5);
  };

  useEffect(() => {
    setProgress(step * 14.28); // 100 / 7 steps
  }, [step]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto !overflow-x-hidden mt-10 md:mt-0">
        {step === 1 && <StepOne user={user} />}
        {step === 2 && (
          <StepTwo user={user} updateFormData={updateFormDataRole} />
        )}
        {step === 3 && (
          <StepThree
            location={formData.location}
            role={formData.role}
            apiKey={apiKey}
            updateFormData={updateFormData}
          />
        )}
        {step === 4 && (
          <StepFour
            location={formData.location}
            user={user}
            formData={formData.location?.address}
            updateFormData={updateFormDataMonths}
            selectedMonths={formData.selectedMonths}
          />
        )}
        {step === 5 && (
          <StepFive
            location={formData.location}
            user={user}
            updateFormData={updateFormData}
            formData={formData.location?.address}
            onComplete={handleStep5Complete}
            onCompleteHours={handleCompleteHours}
          />
        )}
        {step === 6 && (
          <StepSix
            user={user}
            updateFormData={updateFormData}
            formData={formData.location?.address}
            location={formData.location}
            selectedDays={selectedDays}
            onComplete={handleStep6Complete}
            onBack={handleStep6Back}
          />
        )}
        {step === 7 && (
          <StepSeven
            location={formData.location}
            formData={formData.location?.address}
            updateFormData={updateFormDataMonths}
            selectedMonths={formData.selectedMonths}
          />
        )}
      </div>
      <div>
        <div className="w-full absolute top-0 left-0 z-50">
          <Progress value={progress} className="w-full h-[6px] bg-gray-200" />
        </div>
        <div className="flex justify-between px-4 pb-4">
          {step > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              Back
            </Button>
          )}
          {step === 1 && (
            <div className="flex">
              <div onClick={() => router.push("/create")}>
                <HoverButton
                  buttonText="Skip for now"
                  hoverMessage="If you skip these steps users will not be able to purchase products from you."
                />
              </div>
              <div className="ml-4">
                <Button onClick={() => router.push("/")}>Go Home</Button>
              </div>
            </div>
          )}
          {step < 5 && <Button onClick={handleNext}>Next</Button>}
          {step === 7 && <Button onClick={handleNext}>Finish</Button>}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
