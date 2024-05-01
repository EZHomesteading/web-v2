import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { UserInfo } from "@/next-auth";
import { CgCommunity } from "react-icons/cg";
import { FaOpencart } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { MdOutlineFavoriteBorder, MdOutlinePrivacyTip } from "react-icons/md";
import { PiCookieThin, PiStorefrontThin } from "react-icons/pi";
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightCollapseFilled,
} from "react-icons/tb";
import { VscHistory } from "react-icons/vsc";
import Logo from "../components/navbar/Logo";

interface Props {
  user: UserInfo;
}
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}
const navigation: NavigationItem[] = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: GiSettingsKnobs,
    current: true,
  },
  {
    name: "Favorites",
    href: "/dashboard/favorites",
    icon: MdOutlineFavoriteBorder,
    current: false,
  },
  {
    name: "Current Orders",
    href: "/dashboard/reservations",
    icon: FaOpencart,
    current: false,
  },
  {
    name: "Store Settings",
    href: "/dashboard/my-store",
    icon: PiStorefrontThin,
    current: false,
  },
  {
    name: "Transaction History",
    href: "/dashboard/trips",
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
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const Sidebar = () => {
  return (
    <>
      <div className="hidden lg:block w-72 h-full">
        <div className="flex grow flex-col gap-y-6 px-6 overflow-auto">
          <nav className="flex flex-2 flex-col">
            <div className="hidden">
              <Logo />
            </div>

            <ul role="list" className="flex flex-2 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-3 space-y-1">
                  {navigation.map((item) => (
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
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
