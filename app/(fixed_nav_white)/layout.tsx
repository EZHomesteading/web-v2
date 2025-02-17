import { getNavUser, NavUser } from "@/actions/getUser";
import Navbar from "@/components/navbar/navbar.server";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar user={user} className="bg-white zmid border-b" />
      {children}
    </>
  );
};

export default Layout;
