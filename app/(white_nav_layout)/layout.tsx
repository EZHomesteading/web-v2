//dashboard layout parent element
import { getNavUser, NavUser } from "@/actions/getUser";
import { Viewport } from "next";
import Navbar from "@/components/navbar/Navbar";
export const viewport: Viewport = {
  themeColor: "#fff",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar user={user as unknown as NavUser} className="bg-white" />
      {children}
    </>
  );
};

export default Layout;
