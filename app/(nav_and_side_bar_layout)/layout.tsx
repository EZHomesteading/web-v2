import { getNavUser, NavUser } from "@/actions/getUser";
import { OutfitFont } from "@/components/fonts";
import Navbar from "@/components/navbar/navbar.server";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#CED9BB",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar
        user={user as unknown as NavUser}
        className={`sheet zmax md:h-20 h-24 border-t-none `}
      />
      <div
        className={`${OutfitFont.className} sheet min-h-screen overflow-y-auto`}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
