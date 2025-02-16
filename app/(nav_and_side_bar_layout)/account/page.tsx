import {
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
import MenuCard from "../_components/menu-card";
import { SellAccountToggle, UserInfoCard } from "../_components/user-info-card";
import { auth } from "@/auth";

const menuItems = [
  {
    title: "Account Settings",
    name: "Personal Info",
    icon: <PiUserThin className="h-8 w-8" />,
    href: "/account/personal-info",
  },
  {
    name: "Notification Preferences",
    icon: <PiGearThin className="h-8 w-8" />,
    href: "/account/notification-preferences",
    showDiv: false,
  },
  {
    name: "Payment Methods",
    icon: <PiCardholderThin className="h-8 w-8" />,
    href: "/account/payment-methods",
    showDiv: true,
  },
  {
    title: "Activity",
    name: "Orders",
    icon: <PiClipboardTextThin className="h-8 w-8" />,
    href: "/orders",
  },
  {
    name: "Following",
    icon: <PiUsersThreeThin className="h-8 w-8" />,
    href: "/account/following",
    showDiv: true,
  },
  {
    title: "Policies",
    name: "Privacy Policy",
    icon: <PiLockSimpleThin className="h8w8" />,
    href: "/",
  },
  {
    name: "Terms of Service",
    icon: <PiSignatureThin className="h8w8" />,
    href: "/",
  },
  {
    name: "Cookie Policy",
    icon: <PiCookieThin className="h8w8" />,
    href: "/cookie-policy",
  },
  {
    name: "Community Standards",
    icon: <PiBookOpenTextThin className="h8w8" />,
    href: "/",
  },
];

const AccountHome = async () => {
  const session = await auth();
  return (
    <div className="px-2 sm:px-6 md:px-2 lg:px-40 pt-2 md:pt-20 pb-24 md:pb-0 min-h-screen overflow-y-auto relative">
      <div className="w-full md:w-2/3 2xl:w-1/2 mx-auto">
        <UserInfoCard user={session?.user} />
        {menuItems.map((item, index) => (
          <MenuCard
            key={index}
            name={item.name}
            icon={item.icon}
            href={item.href}
            showDiv={item.showDiv}
            title={item.title}
          />
        ))}
      </div>
      <div className={`h-[50vh]`} />
      <SellAccountToggle user={session?.user} />
    </div>
  );
};

export default AccountHome;
