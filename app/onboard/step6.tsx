"use client";

import icon from "@/public/images/website-images/camera-icon.png";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { useState } from "react";
import Avatar from "../components/Avatar";

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
  const handleImageUpload = (url: string) => {
    setImage(url);
    updateFormData({ image: url });
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="border-[2px] border-dashed bg-slate-100 h-[200px] sm:h-[300px]  aspect-square rounded-xl relative shadow-xl">
          {image ? (
            <>
              <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    handleImageUpload(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  className={`${outfit.className} w-[150px] ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full ut-button:border ut-button:border-black rounded-sm`}
                  content={{
                    button({ ready }) {
                      if (ready) return <div>Change Image</div>;
                      return "Loading...";
                    },
                  }}
                />
              </div>
              <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 ">
                <Avatar image={image} />
              </div>{" "}
            </>
          ) : (
            <>
              <div className="absolute bottom-1/2 w-[150px] left-1/2 transform -translate-x-1/2">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    setImage(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  className={`${outfit.className} w-[150px] ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full ut-button:border ut-button:border-black rounded-sm`}
                  content={{
                    button({ ready }) {
                      if (ready)
                        return <div className="">Add Profile Image</div>;
                      return "Loading...";
                    },
                  }}
                />{" "}
              </div>
              <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2">
                <Image src={icon} alt="Add a Photo" width={50} height={50} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StepSix;
