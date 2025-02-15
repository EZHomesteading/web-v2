//dashboard layout parent element
import Sidebar from "./update-listing/components/sidebar";
import { Viewport } from "next";
import BackArrow from "../../_components/back-arrow";

export const viewport: Viewport = {
  themeColor: "#ced9bb",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`flex`}>
      <Sidebar nav="sell" />
      <BackArrow nav="sell" />
      <div className={` w-full bg-inherit min-h-screen relative border-t`}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
