//dashboard layout parent element
import Sidebar from "./update-listing/components/sidebar";
import { Viewport } from "next";
import BackArrow from "../../_components/back-arrow";
import { outfitFont } from "@/components/fonts";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${outfitFont.className} flex flex-row h-full`}>
      <div className="sheet sm:pt-1 border-r-[1px] border-neutral-300">
        <Sidebar nav="sell" />
      </div>
      <BackArrow nav="sell" />
      <div
        className={`sm:pt-0 pt-10 w-full mb-8 bg-inherit min-h-screen relative ${outfitFont.className} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
