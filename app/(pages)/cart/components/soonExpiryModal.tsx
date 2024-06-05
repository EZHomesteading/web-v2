"use client";

import React, { useState, useEffect } from "react";

import Modal from "@/app/components/modals/chatmodals/Modal";

import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/app/components/ui/calendar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  soonExpiry: number;
  createOrder: () => void;
}

const SoonExpiryModal: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  soonExpiry,
  createOrder,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-center items-center   ">
          <div className="w-fit border-none shadow-none">
            <div className="grid gap-4">
              <div className="bg-white">
                <div className="px-1 py-[.35rem] rounded-lg border-gray-200 border-[1px]">
                  {soonExpiry === 1
                    ? `One or more of the products in you cart expires in less than three days!`
                    : `one or more of the products in your cart is nearing its expiry date!`}
                </div>
                <Button
                  onClick={onClose}
                  className="bg-red-300 text-black hover:text-white hover:bg-red-600 shadow-md hover:shadow-xl w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createOrder}
                  className="bg-green-300 text-black hover:text-white hover:bg-green-600 shadow-md hover:shadow-xl w-full"
                >
                  I'm okay with this, Procede to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SoonExpiryModal;
