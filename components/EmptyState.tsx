"use client";
//default emptystate component
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import Heading from "./Heading";
import { OutfitFont } from "@/components/fonts";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  showShop?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters.",
  showReset,
  showShop,
}) => {
  const pathname = usePathname();
  const isMessagePage =
    pathname?.startsWith("/chat") || pathname?.startsWith("/messenger");
  const isStorePage = pathname?.startsWith("/store");
  const isFollowingPage = pathname?.startsWith("/dashboard/follow");
  const router = useRouter();
  if (isMessagePage) {
    title = "Select a chat or start a new conversation";
    subtitle = "New conversations begin when an order is placed";
  }
  if (isFollowingPage) {
    title = "No users found";
    subtitle = "It looks like you aren't following anyone";
  }
  if (isStorePage) {
    title = "This user doesn't have any listings";
    subtitle = "";
  }
  const isFindPage = pathname === "/find-co-ops-and-producers";
  if (isFindPage) {
    title = "No users found in this area";
    subtitle = "Try expanding your search or search for a new location";
  }
  return (
    <div
      className={`${OutfitFont.className}
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
      `}
    >
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Remove all filters"
            onClick={() => router.push("/market")}
          />
        )}
      </div>
      <div className="w-48">
        {showShop && (
          <Button
            outline
            label="Find Produce"
            onClick={() => router.push("/market")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
