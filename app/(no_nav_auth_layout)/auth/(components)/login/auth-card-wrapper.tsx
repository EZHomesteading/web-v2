"use client";
//login card parent element
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Social } from "@/app/(no_nav_auth_layout)/auth/(components)/social";
import { BackButton } from "@/app/(no_nav_auth_layout)/auth/(components)/back-button";
import Image from "next/image";
import logo from "@/public/images/website-images/ezh-logo-no-text.png";
import Link from "next/link";
import { OutfitFont } from "@/components/fonts";

interface CardWrapperProps {
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  className?: string;
}

const phrases = [
  { line1: "Buy local, fresh, & organic ", line2: "produce easily" },
  { line1: "Sell excess produce on", line2: "your schedule" },
  { line1: "Expand your produce", line2: "catalogue" },
];

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  showSocial,
  className,
}: CardWrapperProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex grow flex-col pt-10 w-full min-h-screen ${className}`}
    >
      <Link
        className="flex justify-center items-center hover:cursor-pointer"
        href={`/`}
      >
        <Image src={logo} alt="EZHomesteading logo" height={30} width={30} />
        <span className={`ml-2 text-xl font-normal ${OutfitFont.className}`}>
          EZHomesteading
        </span>
      </Link>
      <div className="my-4 h-20 overflow-hidden text-center">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentPhraseIndex * 5}rem)` }}
        >
          {phrases.map((phrase, index) => (
            <div key={index} className={`h-20 ${OutfitFont.className}`}>
              <div className={` text-gray-600 font-extralight text-3xl`}>
                {phrase.line1}
              </div>
              <div className={` text-gray-600 font-extralight text-3xl mt-1`}>
                {phrase.line2}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card className="relative rounded-xl d1dbbf shadow-md border-2 border-black w-full bg-inherit min-w-[320px] ">
        <CardContent className={`pb-3 pt-6`}>{children}</CardContent>
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
