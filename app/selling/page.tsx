import React from "react";
import {
  PiChartBarThin,
  PiChatCircleThin,
  PiClipboardTextThin,
  PiClockCountdownThin,
  PiHandCoinsThin,
  PiLightbulbThin,
  PiMoneyThin,
  PiStorefrontThin,
} from "react-icons/pi";
import MenuCard from "@/app/account/components/menu-card";
import { CiSettings } from "react-icons/ci";
import UserInfoCard from "@/app/account/components/user-info-card";

const menuItems = [
  {
    title: "To-Dos",
    showTitle: true,
    name: "Today's Obligations",
    href: "/selling/todays-obligations",
    icon: <PiClockCountdownThin className="h8w8" />,
    showDiv: false,
  },
  {
    name: "Orders",
    icon: <PiClipboardTextThin className="h8w8" />,
    href: "/orders",
  },
  {
    name: "Messages",
    icon: <PiChatCircleThin className="h8w8" />,
    href: "/chat",
    showDiv: true,
  },
  {
    title: "Manage My Store",
    showTitle: true,
    name: "Store Settings",
    icon: <CiSettings className="h8w8" />,
    href: "/selling/my-store/settings",
  },
  {
    name: "My Listings",
    icon: <PiStorefrontThin className="h8w8" />,
    href: "/selling/my-store",
    showDiv: true,
  },
  {
    title: "Performance",
    showTitle: true,
    name: "Earnings",
    icon: <PiHandCoinsThin className="h8w8" />,
    href: "/selling/dashboard",
  },
  {
    name: "Payouts",
    icon: <PiMoneyThin className="h8w8" />,
    href: "/selling/payouts",
  },
  {
    name: "Review Feedback",
    icon: <PiLightbulbThin className="h8w8" />,
    href: "/selling/reviews",
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
            showTitle={item.showTitle}
            name={item.name}
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
