//ezh logo component
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
    <div
      className={`hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 `}
    >
      <Link href={href}>
        <h1
          className={`${OutfitFont.className} font-light hover:text-green-800`}
        >
          EZ Homesteading
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
