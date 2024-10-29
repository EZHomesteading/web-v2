"use client";
//dashboard menu popover parent element
import { CiCircleInfo } from "react-icons/ci";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

interface p {
  c: string;
}
const DashPopover = ({ c }: p) => {
  return (
    <Popover>
      <PopoverTrigger>
        <CiCircleInfo />
      </PopoverTrigger>
      <PopoverContent className="bg p-4 rounded-xl shadow-xl z w-[200px] sm:w-fit">
        {c}
      </PopoverContent>
    </Popover>
  );
};

export default DashPopover;
