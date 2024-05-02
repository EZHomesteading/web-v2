import { CgCommunity } from "react-icons/cg";
import { FaOpencart } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { MdOutlineFavoriteBorder, MdOutlinePrivacyTip } from "react-icons/md";
import { PiCookieThin, PiStorefrontThin } from "react-icons/pi";
import { VscHistory } from "react-icons/vsc";
import Logo from "../components/navbar/Logo";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { BsCartPlusFill } from "react-icons/bs";
import { LiaCartArrowDownSolid } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { TbShoppingCartDollar } from "react-icons/tb";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}
const conNav: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
    current: false,
  },
  {
    name: "Profile Settings",
    href: "/dashboard/account-settings/general",
    icon: GiSettingsKnobs,
    current: false,
  },
  {
    name: "Orders",
    href: "/dashboard/reservations",
    icon: FaOpencart,
    current: false,
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
    icon: MdOutlinePrivacyTip,
    current: false,
  },
  {
    name: "Terms of Service",
    href: "#",
    icon: HiOutlineDocument,
    current: false,
  },
  {
    name: "Cookies Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
  },
  {
    name: "Community Standards",
    href: "/community-standards",
    icon: CgCommunity,
    current: false,
  },
];
const vendorNav: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
    current: false,
  },
  {
    name: "Sell Orders",
    href: "/dashboard/orders/seller",
    icon: TbShoppingCartDollar,
    current: false,
  },
  {
    name: "Store Settings",
    href: "/dashboard/my-store/settings",
    icon: PiStorefrontThin,
    current: false,
  },
  {
    name: "Buy Orders",
    href: "/dashboard/orders/buyer",
    icon: LiaCartArrowDownSolid,
    current: false,
  },
  {
    name: "Profile Settings",
    href: "/dashboard/account-settings/general",
    icon: GiSettingsKnobs,
    current: false,
  },

  {
    name: "Transaction History",
    href: "/dashboard/history",
    icon: VscHistory,
    current: false,
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
    icon: MdOutlinePrivacyTip,
    current: false,
  },
  {
    name: "Terms of Service",
    href: "/tos",
    icon: HiOutlineDocument,
    current: false,
  },
  {
    name: "Cookies Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
  },
  {
    name: "Community Standards",
    href: "/community-standards",
    icon: CgCommunity,
    current: false,
  },
];
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const Sidebar = async () => {
  const user = await currentUser();
  return (
    <>
      <div className="hidden lg:block w-72 h-full">
        <div className="flex grow flex-col gap-y-6 px-6 overflow-auto">
          <nav className="flex flex-2 flex-col">
            <div className="hidden">
              <Logo />
            </div>
            <ul role="list" className="flex flex-2 flex-col gap-y-3">
              {user?.role !== UserRole.CONSUMER ? (
                <>
                  {vendorNav.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-81"
                            : "text-gray-401 hover:text-white hover:bg-gray-800",
                          "group flex gap-x-4 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className="h-7 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {conNav.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-81"
                            : "text-gray-401 hover:text-white hover:bg-gray-800",
                          "group flex gap-x-4 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className="h-7 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
