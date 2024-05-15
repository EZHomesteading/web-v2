"use client";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { XCircleIcon } from "lucide-react";

const Page = () => {
  const [image, setImage] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className=" p-2 rounded-lg">
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
            className="ut-allowed-content:hidden ut-button:bg-blue-800 ut-button:text-white ut-button:w-fit ut-button:px-2 ut-button:p-3"
            content={{
              button({ ready }) {
                if (ready)
                  return <div>Sent a photo of the delivered produce</div>;
                return "Getting ready...";
              },
            }}
          />
        )}
        {image && (
          <>
            <div>
              <div className="m-5 relative">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Image
                      src={image}
                      height={180}
                      width={180}
                      alt="a"
                      className="aspect-square rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                      Click to Enlarge
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="xl:flex xl:justify-center">
                    <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                      {" "}
                      <div>
                        <Image
                          src={image}
                          fill
                          className="object-cover w-full"
                          alt="a"
                        />
                      </div>
                      <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                        Close
                      </AlertDialogCancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="m">I have delivered your order</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
