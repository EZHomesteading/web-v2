import { Dispatch, SetStateAction, useState } from "react";
import SliderSelection from "@/app/selling/(container-selling)/my-store/settings/slider-selection";
import { Location, Prisma } from "@prisma/client";
interface p {
  location: Location | null;
  user: any;
  updateFormData: (newData: Partial<{ location: any }>) => void;
  formData: string[] | undefined;
  setOpenMonths: Dispatch<SetStateAction<string[]>>;
}

const StepSix = ({
  user,
  updateFormData,
  setOpenMonths,
  formData,
  location,
}: p) => {
  const [newLocation, setNewLocation] = useState(user?.location?.[0] || null);

  const handleHoursChange = (newHours: any) => {
    let updatedLocation = { ...location };
    if (!updatedLocation) {
      updatedLocation = { hours: newHours };
    } else {
      updatedLocation.hours = newHours;
    }
    setNewLocation(updatedLocation);
    console.log(updatedLocation);
    updateFormData({ location: { 0: updatedLocation } });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const toggleMonth = (month: string) => {
    setOpenMonths((prevDates) => {
      const newDates = prevDates.includes(month)
        ? prevDates.filter((date) => date !== month)
        : [...prevDates, month];
      setOpenMonths(newDates);
      console.log(newDates);
      return newDates;
    });
  };

  return (
    <div className="h-full ">
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Set Days and Hours for your store at{" "}
        {formData && formData?.[0]
          ? `${formData[0]}`
          : user.location[0].address[0]}
      </div>
      <div className=" flex flex-col items-center sm:mt-[10%] mt-[30%] "></div>
    </div>
  );
};

export default StepSix;
