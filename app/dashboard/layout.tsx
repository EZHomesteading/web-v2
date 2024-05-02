import NavbarDashboard from "@/app/components/navbar/navbar-dashboard";
import { Outfit } from "next/font/google";
import Sidebar from "./sidebar";
import { currentUser } from "@/lib/auth";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  return (
    <div className={`${outfit.className} flex flex-row h-screen`}>
      <div className="bg py-3 pt-12">
        <Sidebar />
      </div>

      <div className="flex flex-col bg w-full">
        <NavbarDashboard user={user} />
        <div className="sheet w-full border-t-[0px] ">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
