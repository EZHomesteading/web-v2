import { useState } from "react";
import SliderSelection from "@/app/selling/my-store/settings/slider-selection";
import { Prisma } from "@prisma/client";
import { ExtendedHours } from "@/next-auth";

interface p {
  user: any;
  updateFormData: (newData: Partial<{ location: any }>) => void;
  formData: UserLocation | undefined;
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
const StepSix = ({ user, updateFormData, formData }: p) => {
  const [location, setLocation] = useState(user?.location?.[0] || null);

  const handleHoursChange = (newHours: Prisma.JsonValue) => {
    let updatedLocation = { ...location };
    if (!updatedLocation) {
      updatedLocation = { hours: newHours };
    } else {
      updatedLocation.hours = newHours;
    }
    setLocation(updatedLocation);
    console.log(updatedLocation);
    updateFormData({ location: { 0: updatedLocation } });
  };
  return (
    <div className="h-full ">
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Set Days and Hours for your store at{" "}
        {formData?.[0] && formData?.[0].address
          ? `${formData?.[0].address[0]}`
          : user.location[0].address[0]}
      </div>
      <div className=" flex flex-col items-center sm:mt-[10%] mt-[30%] ">
        <SliderSelection
          hours={user?.location[0]?.hours}
          index={0}
          location={location as any}
          showUpdate={false}
          onHoursChange={(newHours: any) => {
            handleHoursChange(newHours);
          }}
        />
      </div>
    </div>
  );
};

export default StepSix;
