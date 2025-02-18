"use client";
import { ReactNode, useState } from "react";
import { OutfitFont } from "../fonts";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./alert-dialog";
import { cn } from "@/lib/utils";

interface p {
  onClick?: () => void;
  alertTriggerText: string;
  alertTriggerClassName?: string;
  alertContentClassName?: string;
  headingClassName?: string;
  headingText: string;
  subtitleText: string;
  subtitleClassName?: string;
  cancelButtonText: string;
  confirmButtonText: string;
  confirmButtonClassName?: string;
  icon?: ReactNode;
  children?: ReactNode;
  cancelButtonClassName?: string;
}
export default function Alert({
  onClick,
  alertTriggerText,
  alertContentClassName = "sheet",
  alertTriggerClassName,
  headingText,
  headingClassName,
  subtitleText,
  subtitleClassName,
  cancelButtonText,
  cancelButtonClassName,
  confirmButtonClassName,
  confirmButtonText,
  children,
  icon,
}: p) {
  const [open, setOpen] = useState(false);
  function handleConfirm() {
    if (onClick) {
      onClick();
    }
    setOpen(false);
  }
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger
        className={cn(
          "text-md sm:text-xl font-light w-full my-2 border py-4 rounded-sm text-white justify-center text-center flex relative bg-red-500/80",
          alertTriggerClassName
        )}
      >
        {alertTriggerText}
        {icon}
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          `${OutfitFont.className} bg-white pt-3 h-64 w-80 rounded-xl border shadow-xl !border-black zmax`,
          alertContentClassName
        )}
      >
        <div
          className={cn(
            "text-2xl text-center font-bold mt-6",
            headingClassName
          )}
        >
          {headingText}
          <div
            className={cn("text-sm font-light text-center", subtitleClassName)}
          >
            {subtitleText}
          </div>
        </div>
        {children}
        <div className="flex items-center h-16 mt-auto justify-between w-full border-t !border-black">
          <AlertDialogCancel asChild>
            <button
              className={cn(
                "w-1/2 hover:cursor-pointer hover:text-white h-full rounded-bl-xl",
                cancelButtonClassName
              )}
            >
              {cancelButtonText}
            </button>
          </AlertDialogCancel>
          <hr className="h-full border-l !border-black" />
          <button
            className={cn(
              "w-1/2 hover:cursor-pointer hover:bg-red-400 text-red-600 h-full rounded-br-xl",
              confirmButtonClassName
            )}
            onClick={handleConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
