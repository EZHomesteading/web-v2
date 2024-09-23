import React from "react";
import {
  PiChartBarThin,
  PiChatCircleThin,
  PiClipboardTextThin,
  PiMoneyThin,
  PiStorefrontThin,
} from "react-icons/pi";
import MenuCard from "../menu/menu-card";
import { CiSettings } from "react-icons/ci";
import UserInfoCard from "../menu/user-info-card";

const menuItems = [
  {
    title: "Store Settings",
    icon: <CiSettings className="h8w8" />,
    href: "/dashboard/my-store/settings",
  },
  {
    title: "My Listings",
    icon: <PiStorefrontThin className="h8w8" />,
    href: "/dashboard/my-store",
    showDiv: true,
  },
  {
    title: "Orders",
    icon: <PiClipboardTextThin className="h8w8" />,
    href: "/dashboard/orders",
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
    href: "/dashboard",
  },
  {
    title: "Payouts",
    icon: <PiMoneyThin className="h8w8" />,
    href: "/seller/payouts",
  },
];

const AccountHome = () => {
  return (
    <div className="px-2 sm:px-6 md:px-2 lg:w-2/3">
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
  );
};

export default AccountHome;
