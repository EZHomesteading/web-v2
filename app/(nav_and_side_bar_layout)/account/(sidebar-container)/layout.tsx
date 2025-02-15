import Sidebar from "../../selling/(container-selling)/update-listing/components/sidebar";
import BackArrow from "../../_components/back-arrow";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`flex flex-row md:pt-20 pt-16 border-t`}>
      <Sidebar />
      <BackArrow />
      <div className={`border-t w-full pt-2`}>{children}</div>
    </div>
  );
};

export default Layout;
