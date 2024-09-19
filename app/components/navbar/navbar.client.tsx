"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import { navUser } from "@/next-auth";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { UserRole } from "@prisma/client";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { MdDashboard, MdOutlinePrivacyTip } from "react-icons/md";
import { CgCommunity } from "react-icons/cg";
import { FaOpencart } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { PiCookieThin, PiStorefrontThin } from "react-icons/pi";
import { TbShoppingCartDollar } from "react-icons/tb";
import { VscHistory } from "react-icons/vsc";
import { LiaCartArrowDownSolid } from "react-icons/lia";
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}

interface NavbarProps {
  user?: navUser;
  apiKey?: string;
  isDashboard?: boolean;
  isMarketPage?: boolean;
  isChat?: boolean;
  isHome?: boolean;
  canReceivePayouts: boolean;
  uniqueUrl: string;
}

const conNav: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: MdDashboard, current: false },
  {
    name: "Profile Settings",
    href: "/dashboard/account-settings/general",
    icon: GiSettingsKnobs,
    current: true,
  },
  {
    name: "Orders",
    href: "/dashboard/reservations",
    icon: FaOpencart,
    current: false,
  },
  {
    name: "Order History",
    href: "/dashboard/order-history",
    icon: VscHistory,
    current: false,
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
    icon: MdOutlinePrivacyTip,
    current: false,
  },
  {
    name: "Terms of Service",
    href: "#",
    icon: HiOutlineDocument,
    current: false,
  },
  {
    name: "Cookies Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
  },
  {
    name: "Community Standards",
    href: "/community-standards",
    icon: CgCommunity,
    current: false,
  },
];

const vendorNav: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: MdDashboard, current: false },
  {
    name: "Sell Orders",
    href: "/dashboard/orders/seller",
    icon: TbShoppingCartDollar,
    current: false,
  },
  {
    name: "My Store",
    href: "/dashboard/my-store",
    icon: PiStorefrontThin,
    current: false,
  },
  {
    name: "Buy Orders",
    href: "/dashboard/orders/buyer",
    icon: LiaCartArrowDownSolid,
    current: false,
  },
  {
    name: "Profile Settings",
    href: "/dashboard/account-settings/general",
    icon: GiSettingsKnobs,
    current: true,
  },
  {
    name: "Order History",
    href: "/dashboard/order-history",
    icon: VscHistory,
    current: false,
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
    icon: MdOutlinePrivacyTip,
    current: false,
  },
  {
    name: "Terms of Service",
    href: "#",
    icon: HiOutlineDocument,
    current: false,
  },
  {
    name: "Cookies Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
  },
  {
    name: "Community Standards",
    href: "/community-standards",
    icon: CgCommunity,
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({
  user,
  apiKey,
  isDashboard = false,
  isMarketPage = false,
  isChat = false,
  isHome = false,
  canReceivePayouts,
  uniqueUrl,
}: NavbarProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768 && window.innerHeight < 4200);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const renderDashboardNav = () => (
    <Sheet>
      <SheetTrigger
        className={`
    ${isSmallScreen ? "fixed left-0 top-[18vh] w-fit" : "sm:hidden "}
    transition-transform hover:scale-105 focus:scale-105 focus:outline-none
  `}
      >
        <TbLayoutSidebarRightCollapse
          className={`${
            isSmallScreen
              ? "transform text-6xl border shadow-[5px_5px_10px_rgba(0,0,0,0.5),-5px_-5px_10px_rgba(255,255,255,0.5)] text-black rounded-r-lg d1dbbf  -translate-x-1/4"
              : "z border-none"
          }`}
        />
      </SheetTrigger>

      <SheetContent side="left">
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-black/10 px-3 ring-1 ring-white/5 h-screen bg pt-10">
          <nav className="flex flex-2 flex-col">
            <ul role="list" className="flex flex-2 flex-col gap-y-7">
              <li>
                <ul role="list" className="mx-3 space-y-1">
                  {user?.role !== UserRole.CONSUMER
                    ? vendorNav.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-81"
                                : "text-gray-401 hover:text-white hover:bg-gray-800",
                              "group flex gap-x-4 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <item.icon
                              className="h-7 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))
                    : conNav.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-81"
                                : "text-gray-401 hover:text-white hover:bg-gray-800",
                              "group flex gap-x-4 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <item.icon
                              className="h-7 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
  const renderHomeNav = () => (
    <div className="absolute w-full z-[10] bg-emerald-950/70">
      <Container>
        <div className="sm:flex sm:justify-between sm:items-center">
          <Logo />
          <UserMenu
            user={user}
            isHome={true}
            canReceivePayouts={canReceivePayouts}
            uniqueUrl={uniqueUrl}
          />
        </div>{" "}
      </Container>
    </div>
  );

  return (
    <>
      {isHome ? (
        renderHomeNav()
      ) : (
        <>
          <div
            className={`fixed top-0 left-0 right-0  py-3 ${
              isChat ? "bg-[#F1EFE7] border-b-[1px]" : "bg-white"
            } z-10`}
            style={{ height: isSmallScreen ? "12px" : "80px" }} // Adjust the height as needed
          >
            {!isSmallScreen ? (
              <div className="h-full py-3 mt-2">
                <div className="container mx-auto h-full">
                  <div className="flex items-center justify-between h-full">
                    {!isDashboard && <Logo />}
                    {isDashboard && renderDashboardNav()}

                    {isMarketPage && (
                      <div className="py-2">
                        <div className="flex justify-center mb-2">
                          <div className="w-full max-w-2xl">
                            {apiKey && (
                              <FindListingsComponent apiKey={apiKey} />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <UserMenu
                      user={user}
                      canReceivePayouts={canReceivePayouts}
                      uniqueUrl={uniqueUrl}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {isMarketPage && (
                  <div className="container mx-auto">
                    <div className="py-2">
                      <div className="flex justify-center mb-2">
                        <div className="w-full">
                          {apiKey && <FindListingsComponent apiKey={apiKey} />}
                        </div>
                      </div>
                      <Categories user={user} />
                    </div>
                  </div>
                )}
                {isDashboard && renderDashboardNav()}
              </>
            )}
          </div>
          <div style={{ paddingTop: isSmallScreen ? "24px" : "64px" }} />{" "}
          {/* Spacer div */}
          {!isSmallScreen && isMarketPage && (
            <div className="container mx-auto mt-4">
              <Categories user={user} />
            </div>
          )}
        </>
      )}
      {isSmallScreen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
          <UserMenu
            user={user}
            canReceivePayouts={canReceivePayouts}
            uniqueUrl={uniqueUrl}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
