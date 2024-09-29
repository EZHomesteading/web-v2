import { Outfit } from "next/font/google";
// import Link from "next/link";
// import { PiArrowLeftThin } from "react-icons/pi";
import Navbar from "../components/navbar/Navbar";
import { getNavUser } from "@/actions/getUser";
import { navUser } from "@/next-auth";
import Sidebar from "@/app/selling/(container-selling)/update-listing/components/sidebar";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
//notification setting parent element
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
