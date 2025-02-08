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
    <div className={`${OutfitFont.className} `}>
      <div className={`sheet min-h-screen w-full`}>
        <Navbar user={user as unknown as NavUser} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
