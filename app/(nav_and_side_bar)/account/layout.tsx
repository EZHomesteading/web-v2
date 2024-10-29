import { getNavUser, NavUser } from "@/actions/getUser";
import { Viewport } from "next";
import Navbar from "@/app/components/navbar/Navbar";
import { outfitFont } from "@/app/components/outfit.font";

export const viewport: Viewport = {
  themeColor: "#CED9BB",
};

//notification setting parent element
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <div
      className={`pt-1 sm:pt-0 sheet min-h-screen w-full ${outfitFont.className}`}
    >
      <Navbar user={user as unknown as NavUser} />
      {children}
    </div>
  );
};

export default Layout;
