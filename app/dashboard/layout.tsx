//dashboard layout parent element
import NavbarDashboard from "@/app/components/navbar/navbar-dashboard";
import { Outfit } from "next/font/google";
import Sidebar from "./sidebar";
import GetOrderNotificationInfo from "@/actions/user/getUserNav";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await GetOrderNotificationInfo();
  return (
    <div className={`${outfit.className} flex flex-row h-full`}>
      <div className="bg py-3 pt-12">
        <Sidebar role={user?.role} />
      </div>

      <div className="flex flex-col bg w-full">
        <NavbarDashboard user={user} />
        <div className="sheet w-full border-t-[0px] min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
