import { Outfit } from "next/font/google";
import Sidebar from "@/app/selling/(container-selling)/update-listing/components/sidebar";
import BackArrow from "../components/back-arrow";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${outfit.className} flex flex-row h-full`}>
      <div className="sheet sm:pt-1 border-r-[1px] border-neutral-300">
        <Sidebar nav="buy" />
      </div>
      <BackArrow nav="buy" />
      <div
        className={`sm:pt-0 pt-10 w-full px-4 mb-8 sm:px-6 2xl:w-1/2 lg:px-8 bg-inherit min-h-screen relative ${outfit.className} `}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
