//dashboard layout parent element
import Sidebar from "./update-listing/components/sidebar";
import { Viewport } from "next";
import BackArrow from "../../_components/back-arrow";

export const viewport: Viewport = {
  themeColor: "#ced9bb",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`flex md:flex-row flex-col md:pt-20 pt-16 border-t`}>
      <Sidebar nav="sell" />
      <BackArrow nav="sell" />
      <div className={` w-full border-t`}>{children}</div>
    </div>
  );
};

export default DashboardLayout;
