//dashboard layout parent element
import { getNavUser } from "@/actions/getUser";
import { Viewport } from "next";
import { navUser } from "@/next-auth";
import Navbar from "../components/navbar/Navbar";
export const viewport: Viewport = {
  themeColor: "#fff",
};

const MarketLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar user={user as unknown as navUser} isMarketPage={true} />
      {children}
    </>
  );
};

export default MarketLayout;
