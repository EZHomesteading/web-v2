import Logo from "@/components/navbar/Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/components/listings/search-listings";
import { NavUser } from "@/actions/getUser";

interface NavbarProps {
  user?: NavUser;
  apiKey: string;
  isMarketPage?: boolean;
  // isChat?: boolean;
  isHome?: boolean;
  uniqueUrl: string;
  className: string;
  harvestMessages:
    | {
        conversationId: string;
        lastMessageAt: Date;
      }[]
    | undefined;
}

const Navbar = ({
  // isChat,
  user,
  apiKey,
  isMarketPage = false,
  className,
  // canReceivePayouts,
  uniqueUrl,
  harvestMessages,
}: NavbarProps) => {
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 lg:top-0 border-t lg:border-t-none  border-custom p-2 z-10 ${className} w-screen h-20 `}
      >
        <div
          className={`flex items-center justify-evenly lg:justify-between w-full px-4 h-fit ${
            isMarketPage && "bg-white"
          }`}
        >
          <div className={`hidden lg:block max-w-[25%] w-full`}>
            <Logo />
          </div>
          {isMarketPage && (
            <div
              className={`fixed h-20 lg:h-fit top-0 pt-2 lg:pt-0 lg:relative w-full bg-inherit`}
            >
              <div className={`px-4`}>
                <FindListingsComponent apiKey={apiKey} />
              </div>
            </div>
          )}

          <div
            className={`flex items-center w-full justify-evenly lg:justify-end gap-x-3 lg:pt-2`}
          >
            <UserMenu
              user={user}
              uniqueUrl={uniqueUrl}
              harvestMessages={harvestMessages}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
