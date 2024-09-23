import React from "react";
import {
  PiBasketThin,
  PiBookOpenTextThin,
  PiCardholderThin,
  PiClipboardTextThin,
  PiCookieThin,
  PiGearThin,
  PiLockSimpleThin,
  PiSignatureThin,
  PiUsersThreeThin,
  PiUserThin,
} from "react-icons/pi";
import MenuCard from "./components/menu-card";
import UserInfoCard from "./components/user-info-card";

const menuItems = [
  {
    title: "Personal Info",
    icon: <PiUserThin className="h-8 w-8" />,
    href: "/account/personal-info",
  },
  {
    title: "Notification Preferences",
    icon: <PiGearThin className="h-8 w-8" />,
    href: "/account/notification-preferences",
    showDiv: true,
  },
  {
    title: "Orders",
    icon: <PiClipboardTextThin className="h-8 w-8" />,
    href: "/account/orders",
  },
  {
    title: "Cart",
    icon: <PiBasketThin className="h-8 w-8" />,
    href: "/cart",
    showDiv: true,
  },
  {
    title: "Payment Methods",
    icon: <PiCardholderThin className="h-8 w-8" />,
    href: "/cards",
    showDiv: true,
  },
  {
    title: "Following",
    icon: <PiUsersThreeThin className="h-8 w-8" />,
    href: "/account/following",
    showDiv: true,
  },
  {
    title: "Privacy Policy",
    icon: <PiLockSimpleThin className="h8w8" />,
    href: "/",
  },
  {
    title: "Terms of Service",
    icon: <PiSignatureThin className="h8w8" />,
    href: "/",
  },
  {
    title: "Cookie Policy",
    icon: <PiCookieThin className="h8w8" />,
    href: "/cookie-policy",
  },
  {
    title: "Community Standards",
    icon: <PiBookOpenTextThin className="h8w8" />,
    href: "/",
  },
];

const AccountHome = () => {
  return (
    <div className="px-2 sm:px-6 md:px-2 lg:w-2/3">
      <UserInfoCard />
      {menuItems.map((item, index) => (
        <MenuCard
          key={index}
          title={item.title}
          icon={item.icon}
          href={item.href}
          showDiv={item.showDiv}
        />
      ))}
    </div>
  );
};

export default AccountHome;
