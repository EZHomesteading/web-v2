//ezh logo component
"use client";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const outfit = Outfit({
  weight: ["100"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});
interface p {
  isChat?: boolean;
}
const Logo = ({ isChat = false }: p) => {
  const pathname = usePathname();
  const white = pathname === "/";

  return (
    <div
      className={`hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 hidden sm:block`}
    >
      <Link href="/">
        <h1
          className={`${outfit.className} hover:text-green-800 ${
            white ? "text-white" : "text-black"
          }`}
        >
          EZ Homesteading
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
