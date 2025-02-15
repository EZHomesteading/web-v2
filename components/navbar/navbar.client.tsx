import UserMenu from "./menu";
import FindListingsComponent from "@/components/listings/search-listings";
import { NavUser } from "@/actions/getUser";
import Logo from "./Logo";

interface NavbarProps {
  user?: NavUser;
  // uniqueUrl?: string;
  // canReceivePayouts,
  className: string;
  harvestMessages:
    | {
        conversationId: string;
        lastMessageAt: Date;
      }[]
    | undefined;
}

const Navbar = ({
  user,
  className,
  // canReceivePayouts,
  // uniqueUrl,
  harvestMessages,
}: NavbarProps) => {
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 md:top-0 border-t md:border-t-none p-2 z-1 ${className} w-screen h-20 `}
      >
        <div
          className={`flex items-center justify-evenly md:justify-between w-full px-4 h-fit`}
        >
          <Logo />
          <div
            className={`flex items-center w-full justify-evenly md:justify-end gap-x-3`}
          >
            <UserMenu
              user={user}
              // uniqueUrl={uniqueUrl}
              harvestMessages={harvestMessages}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
