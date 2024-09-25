import React from "react";
import {
  PiChartBarThin,
  PiChatCircleThin,
  PiClipboardTextThin,
  PiMoneyThin,
  PiStorefrontThin,
} from "react-icons/pi";
import MenuCard from "@/app/account/components/menu-card";
import { CiSettings } from "react-icons/ci";
import UserInfoCard from "@/app/account/components/user-info-card";

const menuItems = [
  {
    title: "Store Settings",
    icon: <CiSettings className="h8w8" />,
    href: "/selling/my-store/settings",
  },
  {
    title: "My Listings",
    icon: <PiStorefrontThin className="h8w8" />,
    href: "/selling/my-store",
    showDiv: true,
  },
  {
    title: "Orders",
    icon: <PiClipboardTextThin className="h8w8" />,
    href: "/orders",
  },
  {
    title: "Messages",
    icon: <PiChatCircleThin className="h8w8" />,
    href: "/chat",
    showDiv: true,
  },
  {
    title: "Dashboard",
    icon: <PiChartBarThin className="h8w8" />,
    href: "/selling/dashboard",
  },
  {
    title: "Payouts",
    icon: <PiMoneyThin className="h8w8" />,
    href: "/selling/payouts",
  },
];

const SellerHome = () => {
  return (
    <div className="px-2 sm:px-6 md:px-2 lg:px-40 pt-0 md:pt-12 pb-24 md:pb-0">
      <div className="w-full md:w-2/3 2xl:w-1/2 mx-auto">
        <UserInfoCard sellerNav={true} />
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

export default SellerHome;
