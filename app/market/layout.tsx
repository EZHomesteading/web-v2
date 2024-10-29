//dashboard layout parent element
import { getNavUser, NavUser } from "@/actions/getUser";
import { Viewport } from "next";
import Navbar from "../components/navbar/Navbar";
export const viewport: Viewport = {
  themeColor: "#fff",
};

const MarketLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar user={user as unknown as NavUser} isMarketPage={true} />
      {children}
    </>
  );
};

export default MarketLayout;
