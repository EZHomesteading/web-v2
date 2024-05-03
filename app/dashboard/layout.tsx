import NavbarDashboard from "@/app/components/navbar/navbar-dashboard";
import { Outfit } from "next/font/google";
import Sidebar from "./sidebar";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${outfit.className} flex flex-row h-full`}>
      <div className="bg py-3 pt-12">
        <Sidebar />
      </div>

      <div className="flex flex-col bg w-full">
        <NavbarDashboard />
        <div className="sheet w-full border-t-[0px]">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
