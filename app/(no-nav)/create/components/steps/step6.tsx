import React from "react";
import Image from "next/image";
import { BsBucket } from "react-icons/bs";
import { Label } from "@/components/ui/label";
import { CiImageOn } from "react-icons/ci";
import { SimpleUploadButton } from "../image-upload-button";

interface StepSixProps {
  imageSrc: string[];
  setImageSrc: (imageSrc: string[]) => void;
  imageStates: { isHovered: boolean; isFocused: boolean }[];
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: (index: number) => void;
  handleClick: (index: number) => void;
}

const StepSix: React.FC<StepSixProps> = ({
  imageSrc,
  setImageSrc,
  imageStates,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
}) => {
  const handleImageUpload = (url: string) => {
    const newImageSrc = [...imageSrc];
    const emptyIndex = newImageSrc.findIndex((src) => !src);
    if (emptyIndex !== -1) {
      newImageSrc[emptyIndex] = url;
    } else {
      newImageSrc.push(url);
    }
    setImageSrc(newImageSrc);
    console.log("Image uploaded:", url);
    console.log("Updated imageSrc:", newImageSrc);
  };

  const handleImageDelete = (index: number) => {
    const newImageSrc = imageSrc.filter((src, i) => i !== index && src !== "");
    while (newImageSrc.length < 3) {
      newImageSrc.push("");
    }
    setImageSrc(newImageSrc);
    console.log("Image deleted at index:", index);
    console.log("Updated imageSrc:", newImageSrc);
  };

  console.log("Current imageSrc:", imageSrc);

  return (
    <div className="flex flex-col gap-4 min-h-screen fade-in pt-[10%]">
      <div className="flex flex-row justify-center items-start gap-2">
        <div className="w-full sm:max-w-[500px] px-4">
          <div className="flex flex-col">
            <Label className="text-xl w-full font-light m-0 !leading-0">
              Take or Add Photos of your Product
            </Label>
            <div className="text-xs font-extralight text-neutral-500 mb-2">
              Actual photos are preferred over images from the web. Click upload
              image to capture or add a photo.
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`relative aspect-square shadow-sm transition-transform duration-300 rounded-xl ${
                    imageStates[index].isHovered ? "" : ""
                  } ${imageStates[index].isFocused ? "z-10" : "z-0"}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onClick={() => handleClick(index)}
                >
                  {imageSrc[index] ? (
                    <>
                      <Image
                        src={imageSrc[index]}
                        fill
                        alt={`Listing Image ${index + 1}`}
                        className="object-cover rounded-xl"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageDelete(index);
                        }}
                      >
                        <BsBucket size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border-dashed border-2 border-gray-300 h-full bg-gray-50">
                      <CiImageOn size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-center rounded-xl border-dashed border-2 border-gray-300 aspect-square bg-gray-50">
                <SimpleUploadButton onUploadComplete={handleImageUpload} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSix;
