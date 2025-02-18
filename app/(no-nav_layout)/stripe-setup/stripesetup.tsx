"use client";
import { useState } from "react";

import { UserInfo } from "next-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import StepOne from "./step1";
import StepTwo from "./step2";

import { toast } from "sonner";
import { OutfitFont } from "@/components/fonts";

interface Props {
  user: UserInfo;
}

const StripeSetup = ({ user }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [finish, setFinish] = useState(false);
  const handleNext = async () => {
    try {
      if (step === 2) {
        router.push("/selling/my-store");
        return;
      }

      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error(`Error updating data for step ${step}:`, error);
      toast.error("An error occurred while saving your data.");
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* header */}
        <div className="w-full fixed top-0 left-0 zmax"></div>
        {/* main  */}
        <div className={`flex-grow flex`}>
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo user={user} setFinish={setFinish} />}
        </div>
        {/* footer */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white lg:bg-transparent border-t lg:border-none z`}
        >
          <div
            className={`flex justify-between px-4 py-2 ${OutfitFont.className} `}
          >
            {step > 1 && (
              <Button onClick={handlePrevious} variant="outline">
                Back
              </Button>
            )}
            {step === 1 && (
              <div className="flex">
                <Button onClick={() => router.push("/")}>Go Home</Button>
              </div>
            )}
            {step < 2 && <Button onClick={handleNext}>Next</Button>}
            {step === 2 && finish === true && (
              <Button onClick={handleNext}>Finish</Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StripeSetup;
