"use client";

// Importing necessary modules and components
import { CldUploadWidget } from "next-cloudinary"; // Cloudinary upload widget
import Image from "next/image"; // Image component from Next.js
import { useCallback } from "react"; // useCallback hook from React
import { TbPhotoPlus } from "react-icons/tb"; // Icon component for photo plus icon

// Declaring global variable for cloudinary
declare global {
  var cloudinary: any;
}

// Cloudinary upload preset
const uploadPreset = "pgc9ehd5";

// Interface defining props accepted by the ImageUpload component
interface ImageUploadProps {
  onChange: (value: string) => void; // Function to handle image change
  value: string; // Current selected image value
}

// ImageUpload component
const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange, // Function to handle image change received as prop
  value, // Current selected image value received as prop
}) => {
  // Function to handle image upload
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url); // Calling onChange function with the uploaded image URL
    },
    [onChange]
  ); // Dependency array includes onChange function

  // Rendering the ImageUpload component
  return (
    <CldUploadWidget
      onUpload={handleUpload} // Handling image upload
      uploadPreset={uploadPreset} // Setting upload preset
      options={{
        maxFiles: 1, // Limiting the maximum number of files to be uploaded
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()} // Opening upload widget on click
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus
              size={50} // Setting size of photo plus icon
            />
            <div className="font-semibold text-lg">
              Click to upload {/* Text indicating to click to upload */}
            </div>
            {value && ( // Conditional rendering if value exists
              <div
                className="
              absolute inset-0 w-full h-full"
              >
                <Image
                  fill // Setting image to fill container
                  style={{ objectFit: "cover" }} // Setting image style to cover
                  src={value} // Image source
                  alt="House" // Alternative text for image
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload; // Exporting ImageUpload component
