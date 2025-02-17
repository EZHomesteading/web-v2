import {
  PiCalendarCheckThin,
  PiChatCircleThin,
  PiClipboardTextThin,
  PiHandCoinsThin,
  PiLightbulbThin,
  PiMoneyThin,
  PiStorefrontThin,
} from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import UserInfoCard from "../_components/user-info-card";
import MenuCard from "../_components/menu-card";
import { auth } from "@/auth";

const menuItems = [
  {
    title: "To-Dos",
    name: "Sale Orders",
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
    name: "My Locations & Availability",
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

const SellerHome = async () => {
  const session = await auth();
  return (
    <div className="relative h-screen w-full touch-pan-y">
      <div className="absolute inset-0 px-2 sm:px-6 md:px-2 lg:px-40  pb-24 md:pb-0 overflow-y-auto">
        <div className="relative w-full md:w-2/3 2xl:w-1/2 mx-auto">
          <UserInfoCard sellerNav={true} user={session?.user} />
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
          <div className="pb-32" />
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
