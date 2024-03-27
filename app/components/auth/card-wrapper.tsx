"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Header } from "@/app/components/auth/header";
import { Social } from "@/app/components/auth/social";
import { BackButton } from "@/app/components/auth/back-button";
import Button from "../Button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  activeTab: "buy" | "sell" | "sellAndSource";
  onTabChange: (tab: "buy" | "sell" | "sellAndSource") => void;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  activeTab,
  onTabChange,
}: CardWrapperProps) => {
  return (
    <div className="flex flex-col items-center lg:right-[15%]">
      <Card className="relative w-[500px] lg:relative rounded-none cardauth border-none ">
        <CardHeader>
          <Header label={headerLabel} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
      <div className="flex flex-row space-x-7">
        <button
          className={`px-4 py-2 ${
            activeTab === "buy" ? "buttonsActive shadow-md" : "buttonsNotActive"
          }`}
          onClick={() => onTabChange("buy")}
        >
          I want to buy
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "sellAndSource"
              ? "buttonsActive shadow-md"
              : "buttonsNotActive"
          }`}
          onClick={() => onTabChange("sellAndSource")}
        >
          I want to sell & source
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "sell"
              ? "buttonsActive shadow-md"
              : "buttonsNotActive"
          }`}
          onClick={() => onTabChange("sell")}
        >
          I want to sell
        </button>
      </div>
    </div>
  );
};
