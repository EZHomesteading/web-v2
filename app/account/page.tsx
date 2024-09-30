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
    showDiv: false,
  },
  {
    title: "Payment Methods",
    icon: <PiCardholderThin className="h-8 w-8" />,
    href: "/account/payment-methods",
    showDiv: true,
  },
  {
    title: "Orders",
    icon: <PiClipboardTextThin className="h-8 w-8" />,
    href: "/orders",
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
    <div className="px-2 sm:px-6 md:px-2 lg:px-40 pt-0 md:pt-12 pb-24 md:pb-0">
      <div className="w-full md:w-2/3 2xl:w-1/2 mx-auto">
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
    </div>
  );
};

export default AccountHome;
