"use client";
import { useState } from "react";
import ProfileStep from "./profile-step";
import StoreStep from "./store-step";
import StripeStep from "./stripe-step";
import { IoReturnDownBack, IoReturnDownForward } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { Hours } from "@prisma/client";
import { UserInfo } from "@/next-auth";
import { CiCircleInfo } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";

interface Props {
  user: UserInfo;
}

const Onboarding = ({ user }: Props) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{ hours?: Hours }>({});
  const [isLoading, setIsLoading] = useState(false);
  let defaultHours;
  if (user?.hours) {
    defaultHours = user?.hours;
  } else {
    defaultHours = {
      0: [{ open: 480, close: 1020 }],
      1: [{ open: 480, close: 1020 }],
      2: [{ open: 480, close: 1020 }],
      3: [{ open: 480, close: 1020 }],
      4: [{ open: 480, close: 1020 }],
      5: [{ open: 480, close: 1020 }],
      6: [{ open: 480, close: 1020 }],
    };
  }

  const [coOpHours, setCoOpHours] = useState<Hours>(defaultHours);
  const handleNext = async () => {
    if (step === 1) {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/update", { hours: coOpHours });
        console.log(coOpHours);
        if (response.status === 200) {
          toast.success("Hours updated successfully");
          setStep(step + 1);
        } else {
          toast.error("Failed to update hours");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while updating hours");
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
          toast.success("Stripe account connected successfully");
          setStep(step + 1);
        } else {
          toast.error("Failed to connect Stripe account");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while connecting Stripe account");
      }
      setIsLoading(false);
    } else if (step == 3) {
      handleSubmit();
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
        toast.success("Terms of Service accepted successfully");
        setStep(step + 1);
      } else {
        toast.error("Failed to accept Terms of Service");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while accepting Terms of Service");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen w-full text-black">
      <div className="onboard-left sm:w-2/5">
        <div className="flex flex-col items-start px-20 py-20">
          <h2 className="tracking font-medium 2xl:text-2xl text-lg tracking-tight md:pt-[20%]">
            Finish your account setup
          </h2>
          {step === 2 && (
            <div className="flex flex-row">
              <div className="2xl:text-5xl text-lg font-bold tracking-tight">
                Now, tell us about yourself
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CiCircleInfo className="lg:text-4xl" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        A profile picture and description is not required, but
                        it is recommended to encourage consumer confidence.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-row items-center ">
              {" "}
              <div className="2xl:text-5xl text-lg font-bold tracking-tight flex">
                First, let&apos;s set your hours
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CiCircleInfo className="lg:text-4xl" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Use the sliders to set your open and close times for
                        each day of the week, this will determine when consumers
                        are allowed to pick up from your co-op location.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-row">
              <div className="2xl:text-5xl text-lg font-bold tracking-tight">
                Finally, connect with Stripe for easy & secure payouts
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CiCircleInfo className="lg:text-4xl" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        EZHomesteading partners with stripe, all of the
                        information in this form is required by Stripe for
                        regulatory purposes. EZHomesteading does not have access
                        to sensitive information such as your full SSN or Bank
                        Account Info.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      <div className="sm:w-3/5 onboard-right relative">
        {step === 1 && (
          <div className="md:pt-[20%]">
            <StoreStep
              coOpHours={coOpHours}
              setCoOpHours={setCoOpHours}
              user={user}
            />
          </div>
        )}
        {step === 2 && (
          <div className="md:pt-[20%]">
            <ProfileStep
              formData={formData}
              setFormData={setFormData}
              user={user}
            />
          </div>
        )}

        {step === 3 && (
          <div className="p-10">
            <StripeStep
              formData={formData}
              setFormData={setFormData}
              user={user}
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
