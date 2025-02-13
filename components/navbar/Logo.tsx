"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OutfitFont } from "@/components/fonts";

const Logo = () => {
  const pathname = usePathname();
  const href = pathname?.startsWith("/selling")
    ? "/selling"
    : pathname?.startsWith("/account")
    ? "/account"
    : "/";

  return (
    <Link
      href={href}
      className={`select-none hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 ${OutfitFont.className} font-light hover:text-green-800`}
    >
      EZHomesteading
    </Link>
  );
};

export default Logo;
