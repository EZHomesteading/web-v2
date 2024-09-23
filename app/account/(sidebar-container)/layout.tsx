import { Outfit } from "next/font/google";
// import Link from "next/link";
// import { PiArrowLeftThin } from "react-icons/pi";
import Sidebar from "../../selling/update-listing/components/sidebar";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
//notification setting parent element
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${outfit.className} flex flex-row h-full`}>
      <div className="sheet md:pt-10 pt-2 border-r-[1px] border-neutral-300">
        <Sidebar nav="buy" />
      </div>
      <div className={`md:pt-11 pt-2 w-full ${outfit.className} `}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
