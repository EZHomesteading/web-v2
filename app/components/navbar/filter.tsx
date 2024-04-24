"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/user/use-current-user";

const Filters = () => {
  const [radius, setRadius] = useState(0);
  const user = useCurrentUser();
  return (
    <Sheet>
      <SheetTrigger className="absolte flex flex-row border-[1px] border-gray-500 rounded-full px-2 py-2 bg-transparent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        Filters
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-screen sm:w-1/2 md:w-1/3 2xl:w-1/5 px-2 sm:px-4"
      >
        <SheetHeader>Filters</SheetHeader>
        <Slider
          min={1.1}
          max={50}
          step={0.1}
          className="px-2"
          value={[radius]}
          onValueChange={(value) => setRadius(value[0])}
        />
        {user ? (
          user?.role == UserRole.COOP ? (
            <div className="flex flex-col">
              <div className="flex flex-row">
                <Switch /> Co-ops
              </div>
              <div className="flex flex-row">
                <Switch /> Producers
              </div>
            </div>
          ) : user?.role == UserRole.PRODUCER ? (
            <></>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
