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
import StepEight from "./step8";
import { Session } from "next-auth";
import { HoverButton } from "../components/ui/hoverButton";
import { Hours, Location, UserRole } from "@prisma/client";
import { toast } from "sonner";
import StepNine from "./step9";

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
  const [prevSelectedDays, setPrevSelectedDays] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [prevHours, setPrevHours] = useState<any>();
  const [user, setUser] = useState<UserInfo>(initialUser);
  const [formData, setFormData] = useState<{
    locationId?: string;
    role?: UserRole;
    image?: string;
    bio?: string;
    fulfillmentStyle?: string;
    location?: LocationObj;
    hours?: Hours;
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
  const updateFulfillmentData = useCallback(
    (newData: Partial<{ fulfillmentStyle: string }>) => {
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
        if (locations && locations?.length > 3) {
          toast.error(
            "You already have the maximum number of locations. Sending you to Add a Product page."
          );
          router.push("/create");
          return;
        }
        if (formData.location) {
          const response = await axios.post(
            "/api/useractions/update/location-hours",
            {
              location: [formData.location],
            }
          );
          setFormData({
            locationId: response.data.id,
            location: formData.location,
          });
          setUser((prevUser) => ({
            ...prevUser,
            location: response.data || formData.location,
          }));
        }
      } else if (step === 7 && formData.locationId) {
        // Save the updated hours
        if (formData.location?.hours) {
          setUser((prevUser) => ({
            ...prevUser,
            location: formData.location,
          }));
        }
        setStep((prevStep) => prevStep - 1);
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
    if (step === 8) {
      setStep(6);
      return;
    }
    setStep((prevStep) => prevStep - 1);
    setProgress((prevProgress) => prevProgress - 14.28); // 100 / 7 steps
  };
  const handleStep6Complete = (days: string[]) => {
    setSelectedDays([]);
    setSelectedDays(days);
    setPrevSelectedDays((prevdays) => {
      return [...prevdays, ...days];
    });
    setIsEdit(false);
    setStep(7);
  };
  const handleStep8Change = (days: string[]) => {
    setSelectedDays(days);
    setIsEdit(true);
    setStep(7);
  };
  const handleCompleteHours = () => {
    setStep(8);
  };
  const handleStep7Back = () => {
    setStep(6);
  };

  const handleStep7Complete = () => {
    if (isEdit === true) {
      setStep(8);
    } else {
      setSelectedDays([]);
      setStep(6);
    }
  };
  const resetHoursData = async (
    hours: Hours,
    newType: "both" | "delivery" | "pickup"
  ) => {
    try {
      const response = await axios.post(
        "/api/useractions/update/location-hours",
        {
          location: [
            {
              address: formData.location?.address,
              coordinates: formData.location?.coordinates,
              role: formData.role,
              hours: hours,
            },
          ],
          locationId: formData.locationId,
          isDefault: null,
        }
      );

      if (response.data) {
        toast.success("Location hours updated successfully!");
        setSelectedDays([]);
        setPrevSelectedDays([]);
        setIsEdit(false);
        setFormData((prevData) => ({
          ...prevData,
          location: prevData.location
            ? {
                ...prevData.location,
                hours: {
                  delivery: [],
                  pickup: [],
                },
              }
            : undefined,
          fulfillmentStyle: newType === "delivery" ? "pickup" : "delivery",
          hours: {
            delivery: [],
            pickup: [],
          },
          selectedMonths: [],
        }));
        setPrevHours(hours);
        setStep(5);
      } else {
        toast.error("Failed to update location hours. Please try again.");
      }
    } catch (error) {
      console.error("Error updating location hours:", error);
      toast.error("An error occurred while saving your data.");
    }
  };

  const handleFinish = async (newHours: Hours, type: string) => {
    console.log(newHours, prevHours);
    try {
      let updatedHours: Hours;

      if (type === "both") {
        updatedHours = {
          delivery: [...(newHours.delivery || [])],
          pickup: [...(newHours.pickup || [])],
        };
      } else {
        updatedHours = {
          delivery:
            type === "delivery"
              ? [...(newHours.delivery || [])]
              : [...(prevHours?.delivery || [])],
          pickup:
            type === "pickup"
              ? [...(newHours.pickup || [])]
              : [...(prevHours?.pickup || [])],
        };
      }

      const response = await axios.post(
        "/api/useractions/update/location-hours",
        {
          location: [
            {
              address: formData.location?.address,
              coordinates: formData.location?.coordinates,
              role: formData.role,
              hours: updatedHours,
            },
          ],
          locationId: formData.locationId,
          isDefault: null,
        }
      );

      if (response.data) {
        toast.success("Location hours updated successfully!");
        setStep(9);
      } else {
        toast.error("Failed to update location hours. Please try again.");
      }
    } catch (error) {
      console.error("Error updating location hours:", error);
      toast.error("An error occurred while saving your data.");
    }
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
            updateFormData={updateFulfillmentData}
          />
        )}
        {step === 5 && (
          <StepFive
            location={formData.location}
            fulfillmentStyle={formData.fulfillmentStyle ?? "pickup"}
            user={user}
            formData={formData.location?.address}
            updateFormData={updateFormDataMonths}
            selectedMonths={formData.selectedMonths}
          />
        )}
        {step === 6 && (
          <StepSix
            location={formData.location}
            user={user}
            fulfillmentStyle={formData.fulfillmentStyle ?? "pickup"}
            updateFormData={updateFormData}
            formData={formData.location?.address}
            onComplete={handleStep6Complete}
            onCompleteHours={handleCompleteHours}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            prevSelectedDays={prevSelectedDays}
          />
        )}
        {step === 7 && (
          <StepSeven
            user={user}
            updateFormData={updateFormData}
            formData={formData.location?.address}
            location={formData.location}
            selectedDays={selectedDays}
            onComplete={handleStep7Complete}
            onBack={handleStep7Back}
          />
        )}
        {step === 8 && (
          <StepEight
            onDayChange={handleStep8Change}
            location={formData.location}
            formData={formData.location?.address}
            updateFormData={updateFormDataMonths}
            fulfillmentStyle={formData.fulfillmentStyle}
            selectedMonths={formData.selectedMonths}
            locationId={formData.locationId}
            onFinish={handleFinish}
            resetHoursData={resetHoursData}
          />
        )}
        {step === 9 && (
          <StepNine
            onDayChange={handleStep8Change}
            location={formData.location}
            formData={formData.location?.address}
            updateFormData={updateFormDataMonths}
            fulfillmentStyle={formData.fulfillmentStyle}
            selectedMonths={formData.selectedMonths}
            locationId={formData.locationId}
            onFinish={handleFinish}
            resetHoursData={resetHoursData}
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
          {step < 6 && <Button onClick={handleNext}>Next</Button>}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
