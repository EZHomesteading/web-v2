import React from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { BsBucket } from "react-icons/bs";
import Heading from "@/app/components/Heading";

interface StepFiveProps {
  imageSrc: string[];
  setImageSrc: (imageSrc: string[]) => void;
  imageStates: { isHovered: boolean; isFocused: boolean }[];
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: (index: number) => void;
  handleClick: (index: number) => void;
}

const StepFive: React.FC<StepFiveProps> = ({
  imageSrc,
  setImageSrc,
  imageStates,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
}) => {
  return (
    <div className="flex flex-col gap-8 items-stretch h-screen md:h-full fade-in">
      <Heading
        title="Take or Add Photos of your Product"
        subtitle="Actual photos are preferred over images from the web, click upload image to capture or add a photo"
      />
      <div className="flex flex-col sm:flex-row gap-x-2 gap-y-2 items-center justify-center">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`relative h-40 sm:h-60 w-48 transition-transform duration-300 rounded-xl ${
              imageStates[index].isHovered ? "transform shadow-xl" : ""
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
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newImageSrc = [...imageSrc];
                    newImageSrc.splice(index, 1);
                    setImageSrc(newImageSrc);
                  }}
                >
                  <BsBucket />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-xl border-dashed border-2 border-black h-full bg">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    const newImageSrc = [...imageSrc];
                    newImageSrc[index] = res[0].url;
                    setImageSrc(newImageSrc);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  appearance={{
                    container: "h-full w-max",
                  }}
                  className="ut-allowed-content:hidden ut-button:bg-transparent ut-button:text-black ut-button:w-[160px] ut-button:sm:w-[240px] ut-button:px-2 ut-button:h-full"
                  content={{
                    button({ ready }) {
                      if (ready) return <div>Upload Image</div>;
                      return "Getting ready...";
                    },
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepFive;
