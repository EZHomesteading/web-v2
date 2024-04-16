"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import Heading from "./Heading";

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
  const isMessagePage = pathname === "/messenger";
  const router = useRouter();
  if (isMessagePage) {
    title = "Select a chat or start a new conversation";
    subtitle = "";
  }
  const isFindPage = pathname === "/find-co-ops-and-producers";
  if (isFindPage) {
    title = "No users found in this area";
    subtitle = "Try expanding your search or search for a new location";
  }
  return (
    <div
      className="
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
      "
    >
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Remove all filters"
            onClick={() => router.push("/shop")}
          />
        )}
      </div>
      <div className="w-48">
        {showShop && (
          <Button
            outline
            label="Find Produce"
            onClick={() => router.push("/shop")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
