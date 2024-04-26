"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SafeListing } from "@/types";
import CartIcon from "./cart-icon";
import { Button } from "../ui/button";
import { UserInfo } from "@/next-auth";
import { MdOutlineEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface ListingCardProps {
  data: SafeListing;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  secondActionId?: string;
  secondActionLabel?: string;
  onSecondAction?: (id: string) => void;
  user?: UserInfo | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId,
  user,
  secondActionId,
  onSecondAction,
  secondActionLabel,
}) => {
  const router = useRouter();
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId || "");
    },
    [disabled, onAction, actionId]
  );

  const handleSecondAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onSecondAction?.(secondActionId || "");
    },
    [disabled, onSecondAction, secondActionId]
  );

  return (
    <div className="col-span-1 cursor-pointer group">
      <div className="flex flex-col w-full">
        <div
          onClick={() => router.push(`/listings/${data.id}`)}
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imageSrc}
            alt={`${data.title} Listing Image`}
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <CartIcon listingId={data.id} user={user} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {" "}
          <div className="font-semibold text-lg"> {data.title}</div>
          <div className="font-light text-neutral-500">
            {data?.location?.address[1]}, {data?.location?.address[2]}
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div className="flex w-full justify-start">
            <div className="flex flex-row items-center gap-1">
              <div className="font-semibold"> ${data.price}</div>
              {data.quantityType && (
                <div className="font-light">per {data.quantityType}</div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger>
                {onAction && actionLabel && (
                  <Button className="bg-transparent shadow-none text-red-600 text-3xl hover:bg-transparent hover:scale-105 pt-0">
                    <FaDeleteLeft />
                  </Button>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black rounded-lg px-4 py-4 w-fit ">
                <AlertDialogHeader className="text-3xl">
                  Are you sure?
                </AlertDialogHeader>
                <AlertDialogDescription className="text-white pt-2">
                  We cannot recover a listing after it has been deleted, this is
                  irreversible.
                </AlertDialogDescription>

                <AlertDialogFooter className="flex items-center justify-start gap-x-5 pt-3">
                  <AlertDialogAction
                    className="shadow-none bg-red-600 text-3xl hover:bg-red-700 text-md"
                    onClick={handleCancel}
                  >
                    Yes, I&apos;m sure
                  </AlertDialogAction>
                  <AlertDialogCancel className=" shadow-none bg-green-600 text-3xl hover:bg-green-700 text-md text-white border-none hover:text-white m-0">
                    Nevermind
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {onSecondAction && secondActionLabel && (
          <Button
            disabled={disabled}
            onClick={handleSecondAction}
            className="absolute bg-transparent shadow-none text-3xl text-yellow-300 mt-2 ml-2 hover:bg-transparent hover:text-yellow-400"
          >
            <MdOutlineEdit />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
