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
import Button from "../../Button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  label2: string;
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
  label2,
}: CardWrapperProps) => {
  return (
    <div className="flex flex-col items-center lg:right-[15%]">
      <Card className="relative w-[500px] lg:relative rounded-none cardregister border-none">
        <CardHeader>
          <Header label={headerLabel} label2={label2} />
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
      <div className="flex flex-row w-full items-center justify-between">
        <button
          className={`p-6 ${
            activeTab === "buy" ? "buttonsActive shadow-md" : "buttonsNotActive"
          }`}
          onClick={() => onTabChange("buy")}
        >
          I want to buy
        </button>
        <button
          className={`py-6 px-3 ${
            activeTab === "sellAndSource"
              ? "buttonsActive shadow-md"
              : "buttonsNotActive"
          }`}
          onClick={() => onTabChange("sellAndSource")}
        >
          I want to sell & source
        </button>
        <button
          className={`p-6 ${
            activeTab === "sell"
              ? "buttonsActive shadow-md"
              : "buttonsNotActive"
          }`}
          onClick={() => onTabChange("sell")}
        >
          I just want to sell
        </button>
      </div>
    </div>
  );
};
