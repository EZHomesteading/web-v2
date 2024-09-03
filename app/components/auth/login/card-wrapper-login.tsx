"use client";
//login card parent element
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Social } from "@/app/components/auth/social";
import { BackButton } from "@/app/components/auth/back-button";
import Image from "next/image";
import logo from "@/public/images/website-images/ezh-logo-no-text.png";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface CardWrapperProps {
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const phrases = [
  { line1: "Sell excess produce on", line2: "your schedule" },
  { line1: "Expand your produce", line2: "catalogue" },
  { line1: "Buy local, fresh, & organic ", line2: "produce easily" },
];

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex grow flex-col pt-6 [@media(min-height:800px)]:pt-40 [@media(min-height:900px)]:pt-40 w-full min-h-screen px-5">
      <div className="flex justify-center items-center">
        <Image src={logo} alt="EZHomesteading logo" height={30} width={30} />
        <span className={`ml-2 text-xl font-normal ${outfit.className}`}>
          EZHomesteading
        </span>
      </div>
      <div className="my-4 h-20 overflow-hidden text-center">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentPhraseIndex * 5}rem)` }}
        >
          {phrases.map((phrase, index) => (
            <div key={index} className="h-20">
              <div
                className={`${outfit.className} text-gray-600 font-extralight text-3xl`}
              >
                {phrase.line1}
              </div>
              <div
                className={`${outfit.className} text-gray-600 font-extralight text-3xl mt-1`}
              >
                {phrase.line2}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card className="relative rounded-xl shadow-sm border-2 border-black w-full bg-inherit min-w-[320px] ">
        <CardContent className={`${outfit.className} pt-6`}>
          {children}
        </CardContent>
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
