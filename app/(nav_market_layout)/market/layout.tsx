import { getNavUser } from "@/actions/getUser";
import { OutfitFont } from "@/components/fonts";
import FindListingsComponent from "@/components/listings/search-listings";
import Logo from "@/components/navbar/Logo";
import UserMenu from "@/components/navbar/menu";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const MarketLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getNavUser();
  const apiKey = process.env.MAPS_KEY!;
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 lg:top-0 border-t lg:border-t-none  border-custom p-2 z-1 w-screen h-20 bg-white z-navigation  ${OutfitFont.className}`}
      >
        <div
          className={`flex items-center justify-evenly lg:justify-between w-full px-4 h-fit `}
        >
          <div className={`hidden lg:block max-w-[25%] w-full`}>
            <Logo />
          </div>
          <div
            className={`fixed h-20 lg:h-fit top-0 pt-2 lg:pt-0 lg:relative w-full bg-inherit px-2 bg-white`}
          >
            <FindListingsComponent apiKey={apiKey} />
          </div>
          <div
            className={`flex items-center w-full justify-evenly lg:justify-end gap-x-3 lg:pt-2`}
          >
            <UserMenu user={user} harvestMessages={[]} />
          </div>
        </div>
      </div>
      <div className={`z-content`}>{children}</div>
    </>
  );
};

export default MarketLayout;
