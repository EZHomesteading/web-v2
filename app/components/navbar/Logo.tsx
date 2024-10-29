//ezh logo component
"use client";
import { o } from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathname = usePathname();
  const white = pathname === "/";
  const href = pathname?.startsWith("/selling")
    ? "/selling"
    : pathname?.startsWith("/account")
    ? "/account"
    : "/";
  return (
    <div
      className={`hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 hidden sm:block`}
    >
      <Link href={href}>
        <h1 className={`${o.className} font-light hover:text-green-800`}>
          EZ Homesteading
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
