"use client";
//onboarding page
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { LocationObj, UserInfo } from "@/next-auth";
//import { ExtendedHours } from "@/next-auth";
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

import { Session } from "next-auth";
import { HoverButton } from "../components/ui/hoverButton";
import { Location, UserRole } from "@prisma/client";
import { toast } from "sonner";
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
  locations: Location[] | null;
}

const Onboarding = ({
  user: initialUser,
  index,
  apiKey,
  canReceivePayouts,
  session,
  locations,
}: Props) => {
  const router = useRouter();
  const [openMonths, setOpenMonths] = useState<string[]>([]);

  const [step, setStep] = useState(locations ? 2 : index);
  const [user, setUser] = useState<UserInfo>(initialUser);
  const [formData, setFormData] = useState<{
    role?: UserRole;
    image?: string;
    bio?: string;
    location?: LocationObj;
  }>({});

  const [progress, setProgress] = useState(0);
  const stepHandler = (step: number) => {
    setStep(step);
  };

  const handleNext = async () => {
    try {
      if (step === 3) {
        const existingLocations: Location[] = (locations as Location[]) || {};
        const updatedLocation: Location = formData.location as Location;

        if (formData.location) {
          if (locations && locations.length >= 3) {
            toast.error("Sellers are restricted to three locations for now");
          }
          const response = await axios.post(
            "/api/useractions/update/location-hours",
            {
              location: [updatedLocation],
            }
          );

          setUser((prevUser) => ({
            ...prevUser,
            location: response.data.location || updatedLocation,
          }));

          setFormData((prevData) => ({
            ...prevData,
            location: response.data.location || updatedLocation,
          }));
        }
      } else if (step === 6 || step === 7 || step === 8) {
        console.log(formData.location);
        // if (formData.location) {
        //   const response = await axios.post(
        //     "/api/useractions/update/location-hours",
        //     {
        //       location: {
        //         0: {
        //           coordinates: formData?.location
        //             ? formData?.location.coordinates
        //             : location && location?.coordinates,
        //           address: formData?.location
        //             ? formData?.location.address
        //             : location && location?.address,
        //           hours: formData?.location
        //             ? formData?.location.hours
        //             : location && location?.hours,
        //           type: "Point",
        //         },
        //       },
        //     }
        //   );
        //   setUser((prevUser) => ({
        //     ...prevUser,
        //     location: response.data.location || formData.location,
        //   }));
        //}
      } else if (step === 8) {
        // if (formData.image) {
        //   const response = await axios.post("/api/useractions/update", {
        //     image: formData.image,
        //   });
        //   setUser((prevUser) => ({
        //     ...prevUser,
        //     image: response.data.image || formData.image,
        //   }));
        // }
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
    if (step === 5 && location === null) {
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
        {step === 1 && <StepOne user={user} />}
        {step === 2 && <StepTwo user={user} updateFormData={updateFormData} />}
        {step === 3 && (
          <StepThree
            location={formData.location}
            role={formData.role}
            apiKey={apiKey}
            updateFormData={updateFormData}
          />
        )}
        {step === 4 && apiKey && (
          <StepFour
            location={formData.location}
            user={user}
            formData={formData.location?.address}
            updateFormData={updateFormData}
            setOpenMonths={setOpenMonths}
          />
        )}
        {step === 5 && (
          <StepFive
            location={formData.location}
            user={user}
            formData={formData.location?.address}
            updateFormData={updateFormData}
            setOpenMonths={setOpenMonths}
          />
        )}
        {step === 6 && (
          <StepSix
            location={formData.location}
            user={user}
            formData={formData.location?.address}
            updateFormData={updateFormData}
            setOpenMonths={setOpenMonths}
          />
        )}
        {step === 7 && (
          <StepSeven
          // location={formData.location}
          // user={user}
          // formData={formData.location?.address}
          // updateFormData={updateFormData}
          // setOpenMonths={setOpenMonths}
          />
        )}
        {step === 8 && (
          <StepEight
          // location={formData.location}
          // user={user}
          // formData={formData.location?.address}
          // updateFormData={updateFormData}
          // setOpenMonths={setOpenMonths}
          />
        )}
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
              <div className="flex px-4 pb-4">
                <Button onClick={() => router.push("/")}>Go Home</Button>
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
