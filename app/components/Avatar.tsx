"use client";

import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
interface AvatarProps {
  image?: string;
}

const Avatar: React.FC<AvatarProps> = ({ image }: AvatarProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="relative">
          <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-12 md:w-12">
            <Image
              fill
              src={image || "/images/website-images/placeholder.jpg"}
              alt="Avatar"
              className="object-cover"
            />
          </div>
        </div>
      </AlertDialogTrigger>{" "}
      <AlertDialogContent>
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="relative pb-[56.25%]">
              <Image
                fill
                src={image || "/images/website-images/placeholder.jpg"}
                alt="Avatar"
                className="absolute inset-0 object-contain"
              />
            </div>
            <AlertDialogTrigger className="absolute top-2 right-12 lg:right-21 bg-white bg-opacity-70 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                stroke="currentColor"
              >
                <path strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AlertDialogTrigger>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Avatar;
