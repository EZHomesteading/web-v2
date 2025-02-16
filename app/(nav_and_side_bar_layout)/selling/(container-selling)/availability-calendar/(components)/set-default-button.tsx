"use client";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiCheckFat } from "react-icons/pi";

const SetDefaultButton = ({
  userId,
  locationId,
  street,
  className = "border-[1px] rounded-xl w-[300px] h-[100px] shadow-md flex flex-col items-center justify-center",
  title,
}: {
  userId?: string;
  title?: string;
  locationId?: string;
  street?: string;
  className?: string;
}) => {
  const handleSetDefault = async () => {
    try {
      const response = await axios.post("/api/location/update/set-default", {
        userId,
        locationId,
      });
      if (response.status === 200) {
        toast.success(street + " is now your default address");
        window.location.replace("/selling/availability-calendar");
      }
    } catch (error) {}
  };

  return (
    <button className={`${className}`} onClick={handleSetDefault}>
      {title ? <>{title}</> : <>{street}</>}
      <PiCheckFat className={`absolute right-1 top-5 h-6 w-6`} />
    </button>
  );
};

export default SetDefaultButton;
