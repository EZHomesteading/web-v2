"use client";
//register parent element
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Social } from "@/app/components/auth/social";
import { BackButton } from "@/app/components/auth/back-button";
import { Outfit, Zilla_Slab } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const zilla = Zilla_Slab({
  display: "swap",
  weight: "400",
  subsets: ["latin"],
});
interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  label2: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className={`${outfit.className} px-6  `}>
      {" "}
      <div className={`font-normal text-3xl text-center mb-[2%]`}>
        {headerLabel}
      </div>
      <Card className="relative d1dbbf rounded-xl shadow-sm border-[2px]-black w-full min-w-[320px]">
        <CardContent className="pt-6 pb-2 flex flex-col items-center">
          {showSocial && (
            <>
              <Social />
              <div className={`${zilla.className} text-xs my-2`}>OR</div>
            </>
          )}

          {children}
        </CardContent>
        <CardFooter className="rounded-b-xl d1dbbf">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  );
};
