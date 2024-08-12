"use client";
//following card component
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
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
import FollowButton from "./followButton";
import { Prisma } from "@prisma/client";
import Avatar from "../Avatar";

interface ListingCardProps {
  data: {
    name: string;
    id: string;
    image: string | null;
    url: string | null;
    location: {
      0: {
        type: string;
        coordinates: number[];
        address: string[];
        hours: Prisma.JsonValue;
      } | null;
      1: {
        type: string;
        coordinates: number[];
        address: string[];
        hours: Prisma.JsonValue;
      } | null;
      2: {
        type: string;
        coordinates: number[];
        address: string[];
        hours: Prisma.JsonValue;
      } | null;
    } | null;
  } | null;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  secondActionId?: string;
  secondActionLabel?: string;
  onSecondAction?: (id: string) => void;
  followarr:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
}

const FollowCard: React.FC<ListingCardProps> = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId,
  secondActionId,
  onSecondAction,
  secondActionLabel,
  followarr,
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
  const [isHovering, setIsHovering] = useState(false);
  if (!data) {
    return;
  }
  return (
    <div className="col-span-1 cursor-pointer">
      <div className="flex flex-col w-full">
        <div
          onClick={() => router.push(`/profile/${data.id}`)}
          className="  w-full relative flex-row flex  items-start overflow-hidden rounded-xl hover:shadow-xl "
        >
          <Avatar
            image={
              data.image
                ? data?.image
                : "/images/website-images/placeholder.jpg"
            }
          />
          <div className=" pl-1  items-start ">
            <div className="font-semibold text-lg ">{data.name}</div>
            <div className="text-md ">View Profile</div>
          </div>
        </div>
        <div className="font-semibold text-lg flex flex-col h-full ">
          <div className="relative">
            <FollowButton followUserId={data.id} following={followarr} />
            {isHovering && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded-md p-2 transition duration-300">
                Unfollow?
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between">
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

export default FollowCard;
