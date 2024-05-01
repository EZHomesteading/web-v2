import Sidebar from "./sidebar";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${outfit.className} flex flex-row`}>
      <div className="bg pt-12">
        <Sidebar />
      </div>
      <div className="sheet pt-12 w-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
