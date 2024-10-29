import React, { useState } from "react";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { SimpleUploadButton } from "./uploadbutton";
import axios from "axios";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import icon from "@/public/images/website-images/camera-icon.png";
import placeholder from "@/public/images/website-images/placeholder.jpg";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  userImage?: string;
  updateFormData: (newData: Partial<{ image?: string }>) => void;
}

const StepEight = ({ userImage, updateFormData }: Props) => {
  const [image, setImage] = useState(userImage || "");
  const [imageLink, setImageLink] = useState("");

  const handleImageUpload = async (url: string) => {
    setImage(url);
    updateFormData({ image: url });
    try {
      await axios.post("/api/useractions/update", {
        image: url,
      });
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const handleLinkSubmit = () => {
    if (isValidImageUrl(imageLink)) {
      handleImageUpload(imageLink);
    } else {
      alert("Please enter a valid image URL");
    }
  };

  const isValidImageUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.toLowerCase();
      const validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
      ];

      // Check if the URL is valid and ends with a common image extension
      if (validExtensions.some((ext) => path.endsWith(ext))) {
        return true;
      }

      // If no valid extension, check for image-related query parameters
      const queryParams = parsedUrl.search.toLowerCase();
      return (
        queryParams.includes("image") ||
        queryParams.includes("photo") ||
        queryParams.includes("picture")
      );
    } catch (error) {
      return false; // Invalid URL format
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Image
        src={userImage || placeholder}
        alt="Profile Image"
        height={150}
        width={150}
        className="object-fit rounded-full mb-20"
      />
      <h1 className={`${outfit.className} text-xl sm:text-2xl mb-1`}>
        {image ? "Add a New Profile Photo" : "Upload a Profile Photo"}
      </h1>
      <div className="border-[2px] border-dashed bg-slate-100 h-[200px] sm:h-[300px] aspect-square rounded-xl relative shadow-xl">
        <div className="absolute bottom-1/2 left-1/2 transform translate-y-1/2 -translate-x-1/2">
          <SimpleUploadButton onUploadComplete={handleImageUpload} />
        </div>
        <div className="absolute top-[5%] sm:top-[15%] left-1/2 transform -translate-x-1/2 ">
          <Image src={icon} alt="Add a Photo" width={70} height={70} />
        </div>
      </div>
      <h1 className={`${outfit.className} text-xl sm:text-2xl mt-4 mb-2`}>
        Or add one via a Link
      </h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter image URL"
          value={imageLink}
          onChange={(e: any) => setImageLink(e.target.value)}
        />
        <Button onClick={handleLinkSubmit}>Set Image</Button>
      </div>
    </div>
  );
};

export default StepEight;
