import { useState } from "react";
import SliderSelection from "@/app/dashboard/my-store/settings/slider-selection";
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
const StepFour = ({ user, updateFormData }: p) => {
  const [location, setLocation] = useState(user?.location);

  const handleHoursChange = (newHours: Prisma.JsonValue, index: number) => {
    const updatedLocation = { ...location };
    if (!updatedLocation[index]) {
      updatedLocation[index] = { hours: newHours };
    } else {
      updatedLocation[index].hours = newHours;
    }
    setLocation(updatedLocation);
    updateFormData({ location: updatedLocation });
  };
  return (
    <div className="h-full flex items-center justify-center">
      <SliderSelection
        hours={user?.location[0]?.hours}
        index={0}
        location={location as any}
        showUpdate={false}
        onHoursChange={(newHours:any) => handleHoursChange(newHours, 0)}
      />
    </div>
  );
};

export default StepFour;
