import {
  PiCalendarCheckThin,
  PiChatCircleThin,
  PiClipboardTextThin,
  PiClockCountdownThin,
  PiHandCoinsThin,
  PiLightbulbThin,
  PiMoneyThin,
  PiStorefrontThin,
} from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import UserInfoCard from "../_components/user-info-card";
import MenuCard from "../_components/menu-card";

const menuItems = [
  {
    title: "To-Dos",
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
    name: "Store Settings",
    icon: <CiSettings className="h8w8" />,
    href: "/selling/my-store/settings",
  },
  {
    name: "Availability Calendar",
    icon: <PiCalendarCheckThin className="h8w8" />,
    href: "/selling/availability-calendar",
  },
  {
    name: "My Listings",
    icon: <PiStorefrontThin className="h8w8" />,
    href: "/selling/my-store",
    showDiv: true,
  },
  {
    title: "Performance",
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
    <div className="px-2 sm:px-6 md:px-2 lg:px-40 pt-0 md:pt-12 pb-24 md:pb-0 select-none">
      <div className="w-full md:w-2/3 2xl:w-1/2 mx-auto">
        <UserInfoCard sellerNav={true} />
        {menuItems.map((item, index) => (
          <MenuCard
            key={index}
            title={item.title}
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
