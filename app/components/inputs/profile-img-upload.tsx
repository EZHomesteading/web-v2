"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

const uploadPreset = "ejde7bjt";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 3,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2
              p-1 
              border-neutral-300
              flex
              flex-row
              justify-center
              items-center
              gap-4
              text-neutral-600
              rounded-full
            "
          >
            {!value ? (
              <>
                <TbPhotoPlus size={30} />
                <div className="font-semibold text-lg">
                  Change Profile Photo
                </div>
              </>
            ) : (
              <div
                className="        relative 
              inline-block 
              rounded-full 
              overflow-hidden
              h-10 
              w-10 
              md:h-20 
              md:w-20"
              >
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                  alt="Profile Photo"
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
