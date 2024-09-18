//dashboard layout parent element
import { getNavUser } from "@/actions/getUser";
import { Viewport } from "next";
import { navUser } from "@/next-auth";
import Navbar from "../components/navbar/navbar.client";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};

const MarketLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  const apiKey = process.env.MAPS_KEY;
  return (
    <>
      <Navbar
        user={user as unknown as navUser}
        isMarketPage={true}
        apiKey={apiKey}
      />
      {children}
    </>
  );
};

export default MarketLayout;
