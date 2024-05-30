//ezh logo component
import { Outfit } from "next/font/google";
import Link from "next/link";

const outfit = Outfit({
  weight: ["100"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const Logo = () => {
  return (
    <div
      className={`hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 text-grey hidden xl:block`}
    >
      <Link href="/">
        <h1 className={`${outfit.className} hover:text-green-800`}>
          EZ Homesteading
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
