//dashboard layout parent element
import NavbarDashboard from "@/app/components/navbar/navbar-dashboard";
import { Outfit } from "next/font/google";
import Sidebar from "./sidebar";
import { getNavUser } from "@/actions/getUser";
import { Viewport } from "next";
import { UserInfo, navUser } from "@/next-auth";
import Navbar from "../components/navbar/navbar.client";
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
      <div className="sheet py-3 pt-12 border-r-[1px] border-neutral-300 sm:mt-6">
        <Sidebar role={user?.role} />
      </div>

      <div className="flex flex-col bg w-full">
        <Navbar user={user as unknown as navUser} isDashboard={true} />
        <div className="sheet w-full border-t-[0px] min-h-screen sm:mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
