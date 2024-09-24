import { useState } from "react";
import SliderSelection from "@/app/selling/my-store/settings/slider-selection";
import { Prisma } from "@prisma/client";

interface p {
  user: any;
  updateFormData: (newData: Partial<{ location: any }>) => void;
}

interface UserLocation {
  [key: number]: {
    type: string;
    coordinates: number[];
    address: string[];
    hours: Prisma.JsonValue;
  } | null;
}
const StepSix = ({ user, updateFormData }: p) => {
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
    updateFormData({ location: updatedLocation });
  };
  return (
    <div className="h-full flex items-center justify-center">
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
  );
};

export default StepSix;
