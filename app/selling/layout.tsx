import { Outfit } from "next/font/google";
import Navbar from "../components/navbar/Navbar";
import { getNavUser } from "@/actions/getUser";
import { navUser } from "@/next-auth";
import { Viewport } from "next";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
export const viewport: Viewport = {
  themeColor: "#CED9BB",
};
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <div className={`${outfit.className} `}>
      <div
        className={`md:pt-10 pt-2 sheet min-h-screen w-full ${outfit.className} `}
      >
        <Navbar user={user as unknown as navUser} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
