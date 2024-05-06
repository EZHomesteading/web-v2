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

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  label2: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  label2,
}: CardWrapperProps) => {
  return (
    <div className="flex flex-col items-center lg:right-[15%]">
      <Card className="relative w-[280px] sm:w-[450px] md:w-[500px] rounded-none cardauth border-none">
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
    </div>
  );
};
