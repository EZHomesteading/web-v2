"use client";
//renders buttons at bottom of auth form for becoem coop and becoem producer
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Header } from "@/app/components/auth/header";

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

export const CardWrapper = ({
  children,
  headerLabel,
  activeTab,
  onTabChange,
  label2,
}: CardWrapperProps) => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
