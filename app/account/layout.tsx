import { Outfit } from "next/font/google";
// import Link from "next/link";
// import { PiArrowLeftThin } from "react-icons/pi";
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

//notification setting parent element
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <div className={`${outfit.className} `}>
      <div
        className={`pt-1 sm:pt-0 sheet min-h-screen w-full ${outfit.className} `}
      >
        <Navbar user={user as unknown as navUser} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
