"use client";

import {
  PiBookOpenTextThin,
  PiCalendarCheckThin,
  PiCardholderThin,
  PiChatCircleThin,
  PiClipboardTextThin,
  PiClockCountdownThin,
  PiCookieThin,
  PiGearThin,
  PiHandCoinsThin,
  PiLightbulbThin,
  PiLockSimpleThin,
  PiMoneyThin,
  PiSidebarSimpleThin,
  PiSignatureThin,
  PiStorefrontThin,
  PiUsersThreeThin,
  PiUserThin,
} from "react-icons/pi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { usePathname } from "next/navigation";
import { CiSettings } from "react-icons/ci";
import { OutfitFont } from "@/components/fonts";
interface SidebarProps {
  nav?: string;
}
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
  div: boolean;
}

const conNav: NavigationItem[] = [
  {
    name: "Personal Info",
    href: "/account/personal-info",
    icon: PiUserThin,
    current: false,
    div: false,
  },
  {
    name: "Notification Preferences",
    href: "/account/notification-preferences",
    icon: PiGearThin,
    current: false,
    div: false,
  },
  {
    name: "Payment Methods",
    href: "/account/payment-methods",
    icon: PiCardholderThin,
    current: false,
    div: true,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: PiClipboardTextThin,
    current: false,
    div: false,
  },

  {
    name: "Following",
    href: "/account/following",
    icon: PiUsersThreeThin,
    current: false,
    div: true,
  },
  {
    name: "Privacy Policy",
    href: "/",
    icon: PiLockSimpleThin,
    current: false,
    div: false,
  },
  {
    name: "Terms of Service",
    href: "/",
    icon: PiSignatureThin,
    current: false,
    div: false,
  },
  {
    name: "Cookie Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
    div: false,
  },
  {
    name: "Community Standards",
    href: "/",
    icon: PiBookOpenTextThin,
    current: false,
    div: false,
  },
];
const vendorNav: NavigationItem[] = [
  {
    name: "Orders",
    icon: PiClipboardTextThin,
    href: "/orders",
    current: false,
    div: false,
  },
  {
    name: "Messages",
    icon: PiChatCircleThin,
    href: "/chat",
    div: true,
    current: false,
  },
  {
    name: "Store Settings",
    icon: CiSettings,
    href: "/selling/my-store/settings",
    current: false,
    div: false,
  },
  {
    name: "Availability Calendar",
    icon: PiCalendarCheckThin,
    href: "/selling/availability-calendar",
    current: false,
    div: false,
  },
  {
    name: "My Listings",
    icon: PiStorefrontThin,
    href: "/selling/my-store",
    div: true,
    current: false,
  },
  {
    name: "Earnings",
    icon: PiHandCoinsThin,
    href: "/selling/dashboard",
    current: false,
    div: false,
  },
  {
    name: "Payouts",
    icon: PiMoneyThin,
    href: "/selling/payouts",
    div: false,
    current: false,
  },
  {
    name: "Review Feedback",
    icon: PiLightbulbThin,
    href: "/selling/reviews",
    current: false,
    div: false,
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
  const pathname = usePathname();
  const navigationItems = nav === "sell" ? vendorNav : conNav;
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      <div
        className={`hidden ${
          OutfitFont.className
        } md:block border-r border-t z-50 relative h-screen overflow-none select-none ${
          isCollapsed ? "w-[3.51rem]" : "w-64"
        } transition-width duration-300`}
      >
        <div
          className={`flex grow flex-col ${isCollapsed ? "items-center" : ""}`}
        >
          <nav className="flex flex-2 flex-col">
            <ul role="list" className="flex flex-2 flex-col gap-y-3 relative">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "text-white"
                        : "text-gray-401 hover:text-white font-light",
                      "group flex gap-x-4  p-2 text-sm leading-6 t",
                      isCollapsed ? "justify-end" : "items-center",
                      item.div ? "border-b-[1px] pb-4" : ""
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
            <div className="hover:text-black text-white  absolute bottom-50 right-1 ">
              <div className="transform translate-x-[3rem] translate-y-[2rem]  hover:cursor-pointer transition-transform duration-300">
                {`>`}
              </div>
              <PiSidebarSimpleThin
                onClick={toggleSidebar}
                className=" w-10 h-10 transform translate-x-[1.9rem] hover:cursor-pointer transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="hover:text-black text-white  absolute bottom-50 right-1 ">
              <div className="transform translate-x-[3rem] translate-y-[2rem]  hover:cursor-pointer transition-transform duration-300">
                {`<`}
              </div>
              <PiSidebarSimpleThin
                onClick={toggleSidebar}
                className=" w-10 h-10  transform translate-x-[1.9rem] hover:cursor-pointer transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
