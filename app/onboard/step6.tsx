"use client";
import icon from "@/public/images/website-images/camera-icon.png";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { useState } from "react";
import Avatar from "../components/Avatar";
import { SimpleUploadButton } from "./uploadbutton";
import { toast } from "sonner";
import axios from "axios";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface p {
  userImage?: string;
  updateFormData: (newData: Partial<{ image?: string }>) => void;
}

const StepSix = ({ userImage, updateFormData }: p) => {
  const [image, setImage] = useState(userImage || "");

  const handleImageUpload = async (url: string) => {
    setImage(url);
    try {
      await axios.post("/api/useractions/update", {
        image: image,
      });
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        {image ? (
          <h1 className={`${outfit.className} text-xl sm:text-2xl mb-1`}>
            Add a New Profile Photo
          </h1>
        ) : (
          <h1 className={`${outfit.className} text-xl sm:text-2xl mb-1`}>
            Add a Profile Photo{" "}
          </h1>
        )}
        <div className="border-[2px] border-dashed bg-slate-100 h-[200px] sm:h-[300px] aspect-square rounded-xl relative shadow-xl">
          <div className="absolute bottom-1/2 left-1/2 transform translate-y-1/2 -translate-x-1/2">
            <SimpleUploadButton onUploadComplete={handleImageUpload} />
          </div>
          <div className="absolute top-[5%] sm:top-[15%] left-1/2 transform -translate-x-1/2 ">
            <Image src={icon} alt="Add a Photo" width={70} height={70} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepSix;
