"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  label2: string;
  showSocial?: boolean;
  activeTab: "sell" | "sellAndSource";
  onTabChange: (tab: "sell" | "sellAndSource") => void;
}

export const CardWrapperUpdate = ({
  children,
  headerLabel,
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
      </Card>
      <div className="flex flex-row w-full items-center">
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
          I just want to sell to co-ops
        </button>
      </div>
    </div>
  );
};
