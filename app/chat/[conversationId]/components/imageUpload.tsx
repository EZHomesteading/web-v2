// ImageUpload.tsx
import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing"; // Update path to match your project structure
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ImageUploadProps {
  onImageUpload: (url: string) => Promise<void>;
  isLoading: boolean;
  messageType: "pickup" | "delivery";
}

export const ImageUpload = ({
  onImageUpload,
  isLoading,
  messageType,
}: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col text-xs md:text-sm max-w-[90%] gap-y-1 items-end py-1">
      <div className="p-2 rounded-lg">
        {!image && (
          <div>
            <div className="pb-2 rounded-lg">
              {messageType === "pickup"
                ? "Upload an image to confirm item is ready for pickup."
                : "Upload an image to confirm delivery."}
            </div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setImage(res[0].url);
                  onImageUpload(res[0].url).catch((error) =>
                    console.error("Error uploading image:", error)
                  );
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              appearance={{
                container: "h-full w-max",
              }}
              className={`ut-allowed-content:hidden ut-button:bg-blue-800 ut-button:w-fit ut-button:px-2 ut-button:p-3 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              content={{
                button({ ready }) {
                  if (ready)
                    return (
                      <div>
                        Send a photo of the{" "}
                        {messageType === "pickup" ? "produce" : "delivery"}
                      </div>
                    );
                  return isLoading ? "Loading..." : "Getting ready...";
                },
              }}
            />
          </div>
        )}
        {image && (
          <div>
            <div className="m-5 relative">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Image
                    src={image}
                    height={180}
                    width={180}
                    alt="uploaded image"
                    className="aspect-square rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                    Click to Enlarge
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="xl:flex xl:justify-center">
                  <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                    <div>
                      <Image
                        src={image}
                        fill
                        className="object-cover w-full"
                        alt="uploaded image enlarged"
                      />
                    </div>
                    <AlertDialogCancel className="absolute top-3 right-3 bg-transparent border-none px-2 m-0">
                      Close
                    </AlertDialogCancel>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
