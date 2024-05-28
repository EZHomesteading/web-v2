"use client";

import { SheetCartC, SheetContentS } from "@/app/components/ui/support-sheet";
import { SheetTrigger } from "@/app/components/ui/sheet";

interface StatusProps {
  email: string;
}

const SupportButton = ({ email }: StatusProps) => {
  return (
    <SheetCartC>
      <SheetTrigger>Contact Us</SheetTrigger>
      <SheetContentS
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        email={email}
      ></SheetContentS>
    </SheetCartC>
  );
};

export default SupportButton;
