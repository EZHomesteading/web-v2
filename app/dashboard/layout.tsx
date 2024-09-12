//dashboard layout parent element
import NavbarDashboard from "@/app/components/navbar/navbar-dashboard";
import { Outfit } from "next/font/google";
import Sidebar from "./sidebar";
import { getNavUser } from "@/actions/getUser";
import { Viewport } from "next";
import { UserInfo, navUser } from "@/next-auth";
import { UserRole } from "@prisma/client";
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
      <div className="sheet py-3 pt-12 border-r-[1px] border-neutral-300">
        <Sidebar role={user?.role as UserRole} />
      </div>

      <div className="flex flex-col bg w-full">
        <NavbarDashboard user={user as unknown as navUser} />
        <div className="sheet w-full border-t-[0px] min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
