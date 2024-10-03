//dashboard layout parent element
import { Outfit } from "next/font/google";
import Sidebar from "./update-listing/components/sidebar";
import { Viewport } from "next";
import BackArrow from "@/app/account/components/back-arrow";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};
const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${outfit.className} flex flex-row h-full`}>
      <div className="sheet sm:pt-1 border-r-[1px] border-neutral-300">
        <Sidebar nav="sell" />
      </div>
      <BackArrow nav="sell" />
      <div
        className={`sm:pt-0 pt-10 w-full px-4 mb-8 sm:px-6 lg:px-8 bg-inherit min-h-screen relative ${outfit.className} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
