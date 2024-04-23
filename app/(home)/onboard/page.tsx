"use client";
import { useState } from "react";
import ProfileStep from "./profile-step";
import StoreStep from "./store-step";
import StripeStep from "./stripe-step";
import { IoReturnDownBack, IoReturnDownForward } from "react-icons/io5";
import axios from "axios";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import toast from "react-hot-toast";
const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const user = useCurrentUser();

  const handleNext = async () => {
    if (step === 1) {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/update", hours);
        if (response.status === 200) {
          toast.success;
          setStep(step + 1);
        } else {
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
    } else if (step === 2 && !user?.stripeAccountId) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "/api/stripe/create-connected-account",
          { userId: user?.id }
        );
        if (response.status === 200) {
          toast.success;
          setStep(step + 1);
        } else {
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
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
        toast.success;
        setStep(step + 1);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen w-full text-black">
      <div className="onboard-left sm:w-2/5">
        <div className="flex flex-col items-start px-20 py-20">
          {" "}
          <h2 className="tracking font-medium 2xl:text-2xl text-lg tracking-tight md:pt-[20%]">
            Finish your account setup
          </h2>
          {step === 2 && (
            <div className="2xl:text-5xl text-lg font-bold tracking-tight">
              Now, tell us about yourself
            </div>
          )}
          {step === 1 && (
            <div className="2xl:text-5xl text-lg font-bold tracking-tight flex">
              First, lets set your hours
            </div>
          )}
          {step === 3 && (
            <div className="2xl:text-5xl text-lg font-bold tracking-tight">
              Finally, connect with Stripe for easy & secure payouts
            </div>
          )}
        </div>
      </div>

      <div className="sm:w-3/5 onboard-right relative">
        {step === 1 && (
          <div className="md:pt-[20%] ">
            <StoreStep formData={formData} setFormData={setFormData} />
          </div>
        )}
        {step === 2 && (
          <div className="md:pt-[20%] ">
            <ProfileStep formData={formData} setFormData={setFormData} />
          </div>
        )}

        {step === 3 && (
          <div className="p-10">
            <StripeStep
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
            />
          </div>
        )}
        {step > 1 && (
          <button
            onClick={handlePrevious}
            className="absolute bottom-5 left-5 xl:text-[100px]"
          >
            <IoReturnDownBack />
          </button>
        )}
        {step < 3 && (
          <button
            onClick={handleNext}
            className="absolute bottom-5 right-5 xl:text-[100px]"
          >
            <IoReturnDownForward />
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
