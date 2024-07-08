import { useState } from "react";
import CoopHoursSlider from "../components/co-op-hours/co-op-hours-slider";
import SliderSelection from "@/app/dashboard/my-store/settings/slider-selection";
import { Prisma } from "@prisma/client";
interface p {
  user: any;
}
const StepFour = ({ user }: p) => {
  const [locationState, setLocationState] = useState<Location | undefined>(
    location
  );
  return (
    <div className="h-full flex items-center justify-center">
      <SliderSelection
        hours={user?.location[0]?.hours}
        index={0}
        location={
          location as unknown as {
            0: {
              type: string;
              coordinates: number[];
              address: string[];
              hours: Prisma.JsonValue;
            } | null;
            1: {
              type: string;
              coordinates: number[];
              address: string[];
              hours: Prisma.JsonValue;
            } | null;
            2: {
              type: string;
              coordinates: number[];
              address: string[];
              hours: Prisma.JsonValue;
            } | null;
          }
        }
        showUpdate={false}
      />
    </div>
  );
};

export default StepFour;
