import React from "react";
import { PiUserCircleGear } from "react-icons/pi";
import { LiaCartArrowDownSolid } from "react-icons/lia";
import MenuCard from "./menu-card";
import UserInfoCard from "./user-info-card";
import { CiSettings } from "react-icons/ci";

const menuItems = [
  {
    title: "Personal Info",
    icon: <PiUserCircleGear className="h-8 w-8" />,
    href: "/dashboard/account-settings/general",
  },
  {
    title: "Account Preferences",
    icon: <CiSettings className="h-8 w-8" />,
    href: "/dashboard/account-settings/home",
  },
  {
    title: "Orders",
    icon: <LiaCartArrowDownSolid className="h-8 w-8" />,
    href: "/dashboard/orders",
  },
];

const AccountHome = () => {
  return (
    <div className="px-6">
      <UserInfoCard />
      {menuItems.map((item, index) => (
        <MenuCard
          key={index}
          title={item.title}
          icon={item.icon}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default AccountHome;
