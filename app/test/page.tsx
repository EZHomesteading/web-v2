"use client";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";

const Page = () => {
  const [image, setImage] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-sky-500">
        {!image && (
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res: any) => {
              setImage(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            appearance={{
              container: "h-full w-max",
            }}
            className="ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full"
            content={{
              button({ ready }) {
                if (ready) return <div>Upload Image</div>;
                return "Getting ready...";
              },
            }}
          />
        )}
        {image && (
          <>
            <Image src={image} height={100} width={100} alt="a" />{" "}
            <div>I have delivered you order</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
