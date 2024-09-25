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
import StepFive from "./step5";
import StepSix from "./step6";
import StepSeven from "./step7";
import StepEight from "./step8";
import StepNine from "./step9";
import StepTen from "./step10";
import StepEleven from "./step11";
import { Session } from "next-auth";
import { HoverButton } from "../components/ui/hoverButton";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  user: UserInfo;
  index: number;
  apiKey: string;
  canReceivePayouts: boolean | null;
  session: Session;
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

const Onboarding = ({
  user: initialUser,
  index,
  apiKey,
  canReceivePayouts,
  session,
}: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(index);
  const [user, setUser] = useState<UserInfo>(initialUser);
  const [formData, setFormData] = useState<{
    hours?: ExtendedHours;
    image?: string;
    bio?: string;
    location?: UserLocation;
  }>({});

  const [progress, setProgress] = useState(0);
  const stepHandler = (step: number) => {
    setStep(step);
  };

  const handleNext = async () => {
    try {
      if (step === 5) {
        const existingLocations: UserLocation =
          (user.location as UserLocation) || {};
        const updatedLocations: UserLocation = {
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
        if (formData.location) {
          const response = await axios.post("/api/useractions/update", {
            location: updatedLocations,
          });

          setUser((prevUser) => ({
            ...prevUser,
            location: response.data.location || updatedLocations,
          }));

          setFormData((prevData) => ({
            ...prevData,
            location: response.data.location || updatedLocations,
          }));
        }
      } else if (step === 6) {
        console.log(formData.location);
        if (formData.location) {
          const response = await axios.post("/api/useractions/update", {
            location: {
              0: {
                coordinates: formData?.location[0]
                  ? formData?.location[0].coordinates
                  : user?.location?.[0] && user?.location?.[0].coordinates,
                address: formData?.location[0]
                  ? formData?.location[0].address
                  : user?.location?.[0] && user?.location?.[0].address,
                hours: formData?.location[0]
                  ? formData?.location[0].hours
                  : user?.location?.[0] && user?.location?.[0].hours,
                type: "Point",
              },
            },
          });
          setUser((prevUser) => ({
            ...prevUser,
            location: response.data.location || formData.location,
          }));
        }
      } else if (step === 8) {
        if (formData.image) {
          const response = await axios.post("/api/useractions/update", {
            image: formData.image,
          });
          setUser((prevUser) => ({
            ...prevUser,
            image: response.data.image || formData.image,
          }));
        }
      } else if (step === 9) {
        if (formData.bio) {
          const response = await axios.post("/api/useractions/update", {
            bio: formData.bio,
          });
          setUser((prevUser) => ({
            ...prevUser,
            bio: response.data.bio || formData.bio,
          }));
        }
      } else if (step === 11) {
        router.push("/create");
        return;
      }

      setStep((prevStep) => prevStep + 1);
      setProgress((prevProgress) => prevProgress + 11);
    } catch (error) {
      console.error(`Error updating data for step ${step}:`, error);
    }
  };
  const handlePrevious = () => {
    if (step === 5 && user?.location === null) {
      setStep(3);
      setProgress(22);
    } else {
      setStep(step - 1);
      setProgress((step - 1) * 11);
    }
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
        {step === 1 && (
          <StepOne
            session={session}
            canReceivePayouts={canReceivePayouts}
            stepHandler={stepHandler}
          />
        )}
        {step === 2 && <StepTwo user={user} />}
        {step === 3 && <StepThree />}
        {step === 4 && apiKey && <StepFour />}
        {step === 5 && (
          <StepFive
            user={user}
            apiKey={apiKey}
            updateFormData={updateFormData}
          />
        )}
        {step === 6 && (
          <StepSix
            user={user}
            formData={formData.location}
            updateFormData={updateFormData}
          />
        )}
        {step === 7 && <StepSeven />}
        {step === 8 && (
          <StepEight
            userImage={formData.image || user?.image}
            updateFormData={updateFormData}
          />
        )}
        {step === 9 && (
          <StepNine userBio={user?.bio} updateFormData={updateFormData} />
        )}
        {step === 10 && <StepTen />}
        {step === 11 && <StepEleven user={user} />}
      </div>
      <div>
        <div className="w-full absolute top-0 left-0 z-50">
          <Progress value={progress} className="w-full h-[6px] bg-gray-200" />
        </div>
        {step === 1 ? (
          <div>
            <div className="flex justify-center px-4 pb-4">
              <div onClick={() => router.push("/create")}>
                <HoverButton
                  buttonText="Skip for now"
                  hoverMessage="If you skip these steps users will not be able to purchase products from you."
                ></HoverButton>
              </div>
            </div>
            <div className="flex justify-end px-4 pb-4">
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between px-4 pb-4">
            {step > 1 && (
              <Button onClick={handlePrevious} variant="outline">
                Back
              </Button>
            )}

            {(step === 11 || step === 10) && (
              <div onClick={() => router.push("/create")}>
                <HoverButton
                  buttonText="Skip for now"
                  hoverMessage="If you skip these steps you will not be able to withdraw Funds from your account."
                ></HoverButton>
              </div>
            )}
            {step < 11 && <Button onClick={handleNext}>Next</Button>}
            {step === 11 && <Button onClick={handleNext}>Finish</Button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
