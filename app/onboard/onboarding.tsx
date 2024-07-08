"use client";
//onboarding page
import { useState } from "react";
import StripeStep from "./stripe-step";
import axios from "axios";
import { toast } from "sonner";
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

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Props {
  user: UserInfo;
  index: number;
  apiKey?: string;
}
const Onboarding = ({ user, index, apiKey }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(index);
  const [formData, setFormData] = useState<{
    hours?: ExtendedHours;
    image?: string;
    bio?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setStep(step + 1);
    setProgress(step * 10);
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setProgress(step * 10);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/stripe/accept-tos", {
        stripeAccountId: user?.stripeAccountId,
      });
      if (response.status === 200) {
        if (formData.image || formData.bio) {
          try {
            const updateResponse = await axios.post("/api/update", {
              image: formData.image,
              bio: formData.bio,
            });
            if (updateResponse.status === 200) {
            } else {
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
        setStep(step + 1);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while accepting Terms of Service");
    }
    setIsLoading(false);
  };
  const [progress, setProgress] = useState(step * 10);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree user={user} apiKey={apiKey} />}
        {step === 4 && <StepFour user={user} />}
      </div>
      <div className="mt-auto">
        <Progress value={progress} className="w-full mb-4" />
        <div className="flex justify-between px-4 pb-4">
          {step > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              Back
            </Button>
          )}
          {step < 21 && <Button onClick={handleNext}>Next</Button>}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
