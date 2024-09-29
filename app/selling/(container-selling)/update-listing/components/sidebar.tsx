"use client";

import { CgCommunity } from "react-icons/cg";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import {
  PiBasketThin,
  PiBookOpenTextThin,
  PiCardholderThin,
  PiClipboardTextThin,
  PiCookieThin,
  PiGearThin,
  PiLockSimpleThin,
  PiSidebarSimpleThin,
  PiSignatureThin,
  PiStorefrontThin,
  PiUsersThreeThin,
  PiUserThin,
} from "react-icons/pi";
import { MdDashboard } from "react-icons/md";
import { RiUserShared2Line } from "react-icons/ri";
import {
  TbLayoutSidebarLeftCollapse,
  TbShoppingCartDollar,
} from "react-icons/tb";
import { useEffect, useState } from "react";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import Link from "next/link";
import { Outfit } from "next/font/google";
interface SidebarProps {
  nav: string;
}
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}
const o = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const conNav: NavigationItem[] = [
  {
    name: "Personal Info",
    href: "/account/personal-info",
    icon: PiUserThin,
    current: false,
  },
  {
    name: "Notification Preferences",
    href: "/account/notification-preferences",
    icon: PiGearThin,
    current: false,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: PiClipboardTextThin,
    current: false,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: PiBasketThin,
    current: false,
  },
  {
    name: "Payment Methods",
    href: "/account/payment-methods",
    icon: PiCardholderThin,
    current: false,
  },
  {
    name: "Following",
    href: "/account/following",
    icon: PiUsersThreeThin,
    current: false,
  },
  {
    name: "Privacy Policy",
    href: "/",
    icon: PiLockSimpleThin,
    current: false,
  },
  {
    name: "Terms of Service",
    href: "/",
    icon: PiSignatureThin,
    current: false,
  },
  {
    name: "Cookie Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
  },
  {
    name: "Community Standards",
    href: "/",
    icon: PiBookOpenTextThin,
    current: false,
  },
];
const vendorNav: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
    current: false,
  },
  {
    name: "Profile Settings",
    href: "/dashboard/account-settings/general",
    icon: GiSettingsKnobs,
    current: false,
  },
  {
    name: "My Store",
    href: "/dashboard/my-store",
    icon: PiStorefrontThin,
    current: false,
  },
  {
    name: "Store Settings",
    href: "/dashboard/my-store/settings",
    icon: GiSettingsKnobs,
    current: false,
  },
  {
    name: "Orders",
    href: "/dashboard/orders/buyer",
    icon: TbShoppingCartDollar,
    current: false,
  },
  {
    name: "Following",
    href: "/dashboard/following",
    icon: RiUserShared2Line,
    current: false,
  },
];
const Sidebar = ({ nav = "buy" }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const storedCollapsed = sessionStorage.getItem("sidebarCollapsed");
    if (storedCollapsed) {
      setIsCollapsed(JSON.parse(storedCollapsed));
    }
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    sessionStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(newCollapsedState)
    );
  };

  const navigationItems = nav === "sell" ? vendorNav : conNav;
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      <div
        className={`hidden ${o.className} md:block relative h-full ${
          isCollapsed ? "w-[2.8rem]" : "w-64"
        } transition-width duration-300`}
      >
        <div className="flex grow flex-col gap-y-6 px-6">
          <nav className="flex flex-2 flex-col">
            <ul role="list" className="flex flex-2 flex-col gap-y-3 relative">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "font-bold"
                        : "text-gray-401 hover:text-white font-light",
                      "group flex gap-x-4 rounded-md p-2 text-sm leading-6 t",
                      isCollapsed ? "justify-end" : ""
                    )}
                  >
                    <item.icon
                      className="h-7 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="h-10 w-10">
          {isCollapsed ? (
            <PiSidebarSimpleThin
              onClick={toggleSidebar}
              className="hover:text-black text-white w-10 h-10 absolute bottom-50 right-1 transform translate-x-[1.9rem] hover:cursor-pointer transition-transform duration-300"
            />
          ) : (
            <PiSidebarSimpleThin
              onClick={toggleSidebar}
              className="hover:text-black text-white w-10 h-10 absolute bottom-50 right-1 transform translate-x-[1.9rem] hover:cursor-pointer transition-transform duration-300"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
