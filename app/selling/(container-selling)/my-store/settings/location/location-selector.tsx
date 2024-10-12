"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { RiArrowDownSLine } from "react-icons/ri";

interface LocationSelectorProps {
  index: number;
}

const o = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export function LocationSelector({ index }: LocationSelectorProps) {
  const router = useRouter();
  const user = useCurrentUser();
  const locations = user?.location || {};

  const formatAddress = (address: string | string[] | undefined) => {
    if (Array.isArray(address)) {
      return address.join(", ");
    }
    return address || "Address not available";
  };

  const activeLocation = locations[index as keyof typeof locations];
  const activeAddress = activeLocation
    ? formatAddress(activeLocation.address)
    : "Select Location";

  const menuItems = [];
  let hasAvailableSlot = false;

  ([0, 1, 2] as const).forEach((key) => {
    const location = locations[key];
    if (location) {
      menuItems.push(
        <DropdownMenuRadioItem
          key={key}
          value={key.toString()}
          className="hover:cursor-pointer w-full"
        >
          {formatAddress(location.address)}
        </DropdownMenuRadioItem>
      );
    } else {
      hasAvailableSlot = true;
    }
  });

  if (hasAvailableSlot) {
    menuItems.push(
      <DropdownMenuRadioItem
        key="add-new"
        value="add-new"
        className="hover:cursor-pointer w-full"
      >
        Add New Location & Hours
      </DropdownMenuRadioItem>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="w-full bg-inherit flex items-center justify-start py-8 shadow-md"
      >
        <Button
          variant="outline"
          className="w-full relative select-none hover:bg-inherit"
        >
          <div className="truncate max-w-[87%] text-start select-none text-xl">
            {activeAddress}
          </div>

          <RiArrowDownSLine
            className="absolute bottom-[-1] right-0"
            size={50}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-full ${o.className}`}>
        <DropdownMenuRadioGroup
          value={index.toString()}
          onValueChange={(value) => {
            router.push(`/selling/my-store/settings/location/${value}`);
          }}
          className="w-full"
        >
          {menuItems}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
