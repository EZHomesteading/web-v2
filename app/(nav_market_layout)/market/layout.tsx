import { getNavUser, NavUser } from "@/actions/getUser";
import Navbar from "@/components/navbar/navbar.server";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const MarketLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  return (
    <>
      <Navbar
        user={user as unknown as NavUser}
        isMarketPage={true}
        className="bg-white"
      />
      {children}
    </>
  );
};

export default MarketLayout;
