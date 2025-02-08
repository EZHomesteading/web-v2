//dashboard layout parent element
import { getNavUser, NavUser } from "@/actions/getUser";
import Navbar from "@/components/navbar/navbar.server";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#fff",
};
// test
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar
        user={user as unknown as NavUser}
        className="sm:bg-black/30 bg-white sm:!text-white !fixed "
      />
      {children}
    </>
  );
};

export default Layout;
