"use client";
//back button component for auth
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OutfitFont } from "@/components/fonts";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link href={href} className={`${OutfitFont.className}`}>
        {label}
      </Link>
    </Button>
  );
};
