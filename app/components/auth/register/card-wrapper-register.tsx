"use client";
//register parent element
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Header } from "@/app/components/auth/header";
import { Social } from "@/app/components/auth/social";
import { BackButton } from "@/app/components/auth/back-button";

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
      <Card className="relative w-[80%] sm:w-[450px] md:w-[500px] rounded-none cardregister border-none">
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
        <div className="flex flex-row w-full items-center justify-between">
          <button
            className={`md:p-6 ${
              activeTab === "buy"
                ? "buttonsActive shadow-md"
                : "buttonsNotActive"
            }`}
            onClick={() => onTabChange("buy")}
          >
            I want to buy
          </button>
          <button
            className={`md:py-6 md:px-3 ${
              activeTab === "sellAndSource"
                ? "buttonsActive shadow-md"
                : "buttonsNotActive"
            }`}
            onClick={() => onTabChange("sellAndSource")}
          >
            I want to sell & source
          </button>
          <button
            className={`md:p-6 ${
              activeTab === "sell"
                ? "buttonsActive shadow-md"
                : "buttonsNotActive"
            }`}
            onClick={() => onTabChange("sell")}
          >
            I just want to sell
          </button>
        </div>
      </Card>
    </div>
  );
};
