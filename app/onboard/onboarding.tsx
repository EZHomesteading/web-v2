"use client";
//onboarding page
import { useState } from "react";
import ProfileStep from "./profile-step";
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
    if (step === 3) {
      handleSubmit();
      router.push("/dashboard/my-store");
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
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
  const [progress, setProgress] = useState();
  return (
    <div className="">
      {step === 1 && (
        <div>
          <StepOne />
        </div>
      )}
      {step === 2 && (
        <div>
          <ProfileStep
            formData={formData}
            setFormData={setFormData}
            user={user}
          />
        </div>
      )}
      {step === 3 && (
        <div>
          <StripeStep user={user} />
        </div>
      )}
      <Progress value={progress} className="w-[100%] absolute bottom-20" />
      {step > 1 && (
        <Button
          onClick={handlePrevious}
          className="absolute bottom-0 left-5 text-6xl hover:cursor-pointer"
        >
          Back
        </Button>
      )}

      {step < 4 && (
        <Button
          onClick={handleNext}
          className="absolute bottom-5 right-5 hover:cursor-pointer"
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default Onboarding;
