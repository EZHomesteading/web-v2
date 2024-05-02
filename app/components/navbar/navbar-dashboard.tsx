import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import AuthButtons from "./auth-buttons";
import { UserInfo } from "@/next-auth";
import SearchNative from "./search-native";
import { CgCommunity } from "react-icons/cg";
import { FaOpencart } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import {
  MdDashboard,
  MdOutlineFavoriteBorder,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { PiCookieThin, PiStorefrontThin } from "react-icons/pi";
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightCollapseFilled,
  TbShoppingCartDollar,
} from "react-icons/tb";
import { VscHistory } from "react-icons/vsc";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { BsCartPlusFill } from "react-icons/bs";
import { LiaCartArrowDownSolid } from "react-icons/lia";
interface NavbarProps {
  user?: UserInfo;
}
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}
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
    current: true,
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
    current: true,
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
const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className="sheet">
      <div className="relative lg:absolute lg:top-5 lg:right-0 w-full z-10">
        <Container>
          <div className="flex flex-row items-center justify-end  gap-3 md:gap-0">
            <Sheet>
              <SheetTrigger className="lg:hidden absolute left-0 w-fit ">
                <TbLayoutSidebarRightCollapse
                  size={50}
                  className="z border-none"
                />
              </SheetTrigger>
              <SheetContent side="left">
                <>
                  <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-black/10 px-3 ring-1 ring-white/5 h-screen bg pt-10">
                    <nav className="flex flex-2 flex-col">
                      <ul role="list" className="flex flex-2 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="mx-3 space-y-1">
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
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              </SheetContent>
            </Sheet>
            <div className="z">
              {user ? <UserMenu user={user} /> : <AuthButtons />}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
