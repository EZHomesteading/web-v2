//dashboard layout parent element
import Navbar from "@/app/components/navbar/Navbar";
import { Outfit } from "next/font/google";
import Sidebar from "./update-listing/components/sidebar";
import { getNavUser } from "@/actions/getUser";
import { Viewport } from "next";
import { navUser } from "@/next-auth";
import BackArrow from "@/app/account/components/back-arrow";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};
const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <div className={`${outfit.className} flex flex-row h-full`}>
      <div className="sheet md:pt-10 pt-2 border-r-[1px] border-neutral-300">
        <Sidebar nav="sell" />
      </div>
      <BackArrow nav="sell" />
      <div
        className={`md:pt-11 pt-10 w-full px-4 mb-8 sm:px-6 2xl:w-1/2 lg:px-8 bg-inherit min-h-screen relative ${outfit.className} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
