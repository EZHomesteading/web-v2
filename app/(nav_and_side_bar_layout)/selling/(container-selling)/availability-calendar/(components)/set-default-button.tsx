"use client";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SetDefaultButton = ({
  userId,
  locationId,
  street,
  className = "border-[1px] rounded-xl w-[300px] h-[100px] shadow-md flex flex-col items-center justify-center",
  title,
}: {
  userId?: string;
  title?: string;
  locationId: string;
  street: string;
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
    <Button className={`${className}`} onClick={handleSetDefault}>
      {title ? <>{title}</> : <>{street}</>}
    </Button>
  );
};

export default SetDefaultButton;
