"use client";

import { GiSettingsKnobs } from "react-icons/gi";
import {
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
import { TbShoppingCartDollar } from "react-icons/tb";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { usePathname } from "next/navigation";
interface SidebarProps {
  nav: string;
}
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
  div: boolean;
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
    name: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
    current: false,
    div: false,
  },
  {
    name: "My Listings",
    href: "/dashboard/my-store",
    icon: PiStorefrontThin,
    current: false,
    div: false,
  },
  {
    name: "Store Settings",
    href: "/dashboard/my-store/settings",
    icon: GiSettingsKnobs,
    current: false,
    div: false,
  },
  {
    name: "Orders",
    href: "/dashboard/orders/buyer",
    icon: TbShoppingCartDollar,
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
                      pathname === item.href
                        ? "text-white"
                        : "text-gray-401 hover:text-white font-light",
                      "group flex gap-x-4 rounded-md p-2 text-sm leading-6 t",
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
