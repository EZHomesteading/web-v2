"use client";
//user menu popover component
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import MenuItem from "./MenuItem";
import { FaComment, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { CiShop, CiUser } from "react-icons/ci";
import { usePathname, useRouter } from "next/navigation";
import { MdDashboard, MdSettings } from "react-icons/md";
import { BsBasket } from "react-icons/bs";
import { GiBarn, GiFruitTree } from "react-icons/gi";
import { Outfit } from "next/font/google";
import { GoPeople } from "react-icons/go";
import Avatar from "../Avatar";
import { LiaMapMarkedSolid } from "react-icons/lia";
import NotificationIcon from "../icons/notification";
import CartIcon from "@/app/components/icons/cart-icon";
import { BsPersonPlus } from "react-icons/bs";
import {
  PiChartBarThin,
  PiHeartThin,
  PiHouseThin,
  PiMapTrifoldThin,
  PiPersonSimpleRunThin,
  PiPlusThin,
  PiStorefrontThin,
  PiUserCircleThin,
} from "react-icons/pi";
import { Button } from "../ui/button";
import { navUser } from "@/next-auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IoInformationCircleOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image from "next/image";
import { IoIosMenu } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { UserRole } from "@prisma/client";
import placeholder from "@/public/images/website-images/placeholder.jpg"
const outfit = Outfit({
  subsets: ["latin"],
  display: "auto",
  style: "normal",
  weight: ["100"],
});
interface Props {
  user?: navUser;
}
const UserMenu = ({ user }: Props) => {
  const pathname = usePathname();
  const white = pathname === "/";
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [about, setAbout] = useState(false);
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);
  const isMdOrLarger = useMediaQuery("(min-width: 768px)");
  const toggleAbout = () => {
    setAbout((prevState) => !prevState);
  };

  const hasNotifications =
    (user?.sellerOrders?.length ?? 0) > 0 ||
    (user?.buyerOrders?.length ?? 0) > 0;

  const isCartEmpty = (user?.cart?.length ?? 0) === 0;
  const IconWrapper: React.FC<{
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }> = ({ icon: Icon, label, onClick }) => (
    <div
      className="flex flex-col items-center hover:cursor-pointer"
      onClick={onClick}
    >
      <Icon
        className={`h-8 w-8 ${pathname === "/" ? "text-white" : "text-black"}`}
      />
      <div
        className={`text-xs ${outfit.className} ${
          pathname === "/" ? "text-white" : "text-black"
        }`}
      >
        {label}
      </div>
    </div>
  );
  const renderIcons = () => {
    const icons = [];

    if (!user) {
      icons.push(
        <IconWrapper
          key="home"
          icon={PiHouseThin}
          label="Home"
          onClick={() => router.push("/")}
        />,
        <IconWrapper
          key="map"
          icon={PiMapTrifoldThin}
          label="Map"
          onClick={() => router.push("/map")}
        />,
        <IconWrapper
          key="market"
          icon={PiStorefrontThin}
          label="Market"
          onClick={() => router.push("/market")}
        />,
        <IconWrapper
          key="create"
          icon={PiPlusThin}
          label="Create"
          onClick={() => router.push("/create")}
        />,
        <MenuIcon key="menu" user={user} />
      );
    } else if (user.role === UserRole.PRODUCER || user.role === UserRole.COOP) {
      if (isMdOrLarger) {
        // COOP or PRODUCER on larger screens: Show all 7 icons
        icons.push(
          <CartIcon key="cart" cart={user.cart} />,
          <IconWrapper
            key="map"
            icon={PiMapTrifoldThin}
            label="Map"
            onClick={() => router.push("/map")}
          />,
          <NotificationIcon
            key="alerts"
            sOrders={user.sellerOrders}
            bOrders={user.buyerOrders}
          />,
          <IconWrapper
            key="market"
            icon={PiStorefrontThin}
            label="Market"
            onClick={() => router.push("/market")}
          />,
          <IconWrapper
            key="create"
            icon={PiPlusThin}
            label="Create"
            onClick={() => router.push("/create")}
          />,
          <IconWrapper
            key="dashboard"
            icon={PiChartBarThin}
            label="Dashboard"
            onClick={() => router.push("/dashboard")}
          />,
          <MenuIcon key="menu" user={user} />
        );
      } else {
        // COOP or PRODUCER on smaller screens: Up to 5 icons with priority
        icons.push(
          <IconWrapper
            key="create"
            icon={PiPlusThin}
            label="Create"
            onClick={() => router.push("/create")}
          />,
          <IconWrapper
            key="market"
            icon={PiStorefrontThin}
            label="Market"
            onClick={() => router.push("/market")}
          />,
          <MenuIcon key="menu" user={user} />
        );
        if (!isCartEmpty || hasNotifications) {
          icons.push(
            !isCartEmpty && <CartIcon key="cart" cart={user.cart} />,
            hasNotifications && (
              <NotificationIcon
                key="alerts"
                sOrders={user.sellerOrders}
                bOrders={user.buyerOrders}
              />
            )
          );
        }
        if (icons.length < 5)
          icons.push(
            <IconWrapper
              key="map"
              icon={PiMapTrifoldThin}
              label="Map"
              onClick={() => router.push("/map")}
            />
          );
        if (icons.length < 5)
          icons.push(
            <IconWrapper
              key="dashboard"
              icon={PiChartBarThin}
              label="Dashboard"
              onClick={() => router.push("/dashboard")}
            />
          );
      }
    } else if (user.role === UserRole.CONSUMER) {
      if (isMdOrLarger) {
        // CONSUMER on larger screens: Show all 7 icons
        icons.push(
          <CartIcon key="cart" cart={user.cart} />,
          <IconWrapper
            key="map"
            icon={PiMapTrifoldThin}
            label="Map"
            onClick={() => router.push("/map")}
          />,
          <NotificationIcon
            key="alerts"
            sOrders={user.sellerOrders}
            bOrders={user.buyerOrders}
          />,
          <IconWrapper
            key="market"
            icon={PiStorefrontThin}
            label="Market"
            onClick={() => router.push("/market")}
          />,
          <IconWrapper
            key="create"
            icon={PiPlusThin}
            label="Create"
            onClick={() => router.push("/create")}
          />,
          <IconWrapper
            key="dashboard"
            icon={PiChartBarThin}
            label="Dashboard"
            onClick={() => router.push("/dashboard")}
          />,
          <MenuIcon key="menu" user={user} />
        );
      } else {
        icons.push(
          <IconWrapper
            key="map"
            icon={PiMapTrifoldThin}
            label="Map"
            onClick={() => router.push("/map")}
          />,
          <IconWrapper
            key="market"
            icon={PiStorefrontThin}
            label="Market"
            onClick={() => router.push("/market")}
          />,
          <MenuIcon key="menu" user={user} />
        );
        if (!isCartEmpty || hasNotifications) {
          icons.push(
            !isCartEmpty && <CartIcon key="cart" cart={user.cart} />,
            hasNotifications && (
              <NotificationIcon
                key="alerts"
                sOrders={user.sellerOrders}
                bOrders={user.buyerOrders}
              />
            )
          );
        }
        if (icons.length < 5)
          icons.push(
            <IconWrapper
              key="create"
              icon={PiPlusThin}
              label="Create"
              onClick={() => router.push("/create")}
            />
          );
        if (icons.length < 5)
          icons.push(
            <IconWrapper
              key="dashboard"
              icon={PiChartBarThin}
              label="Dashboard"
              onClick={() => router.push("/dashboard")}
            />
          );
      }
    }

    return icons.filter(Boolean).slice(0, 7);
  };
  const MenuIcon: React.FC<{ user?: navUser }> = ({ user }) => (
    <>
      <SheetTrigger className="flex flex-col items-center sm:hidden hover:cursor-pointer">
        <PiUserCircleThin
          className={`h-8 w-8 ${
            pathname === "/" ? "text-white" : "text-black"
          }`}
        />
        <div
          className={`text-xs ${outfit.className} ${
            pathname === "/" ? "text-white" : "text-black"
          }`}
        >
          Menu
        </div>
      </SheetTrigger>
      <SheetTrigger className="relative shadow-md border-[1px] py-1 px-2 rounded-full hidden sm:flex justify-center items-center hover:cursor-pointer">
        <IoIosMenu
          className={`w-4 h-4 mr-1 ${
            pathname === "/" ? "text-white" : "text-black"
          }`}
        />
        <Image
          src={user?.image || placeholder}
          alt="Profile Image"
          height={25}
          width={25}
          className="object-fit rounded-full"
        />
      </SheetTrigger>
    </>
  );
  return (
    <Sheet>
      <div className="flex flex-row items-center justify-between sm:justify-end pt-2 min-w-screen gap-x-3 md:gap-x-4">
        {renderIcons()}
      </div>
      <SheetContent
        side={isMdOrLarger ? "right" : "bottom"}
        className={`${outfit.className} bg pt-5 overflow-y-auto h-screen`}
      >
        <div>
          {user && (
            <div className="flex flex-row px-4">
              <Avatar image={user?.image} />
              <div className="flex flex-col ml-2">
                <div className="font-bold">{user?.name}</div>
                <div>{user?.firstName}</div>
              </div>
            </div>
          )}

          <div>
            {user?.role === "COOP" ? (
              <div>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="Sell Orders"
                    icon={<FaStore className="mr-2" />}
                    onClick={() => router.push("/dashboard/orders/seller")}
                  />
                </SheetTrigger>
              </div>
            ) : user?.role === "PRODUCER" ? (
              <div>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="Sell Orders"
                    icon={<FaStore className="mr-2" />}
                    onClick={() => router.push("/dashboard/orders/seller")}
                  />
                </SheetTrigger>
              </div>
            ) : (
              <div></div>
            )}
            {user ? (
              <>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="Dashboard"
                    icon={<MdDashboard className="mr-2" />}
                    onClick={() => router.push("/dashboard")}
                  />{" "}
                  <MenuItem
                    label="Chat"
                    icon={<FaComment className="mr-2" />}
                    onClick={() => router.push("/chat")}
                  />{" "}
                  <MenuItem
                    label="Market"
                    icon={<CiShop className="mr-2" />}
                    onClick={() => router.push("/market")}
                  />
                  <MenuItem
                    label="Map"
                    icon={<LiaMapMarkedSolid className="mr-2" />}
                    onClick={() => router.push("/map")}
                  />
                  <MenuItem
                    label="Cart"
                    icon={<BsBasket className="mr-2" />}
                    onClick={() => router.push("/cart")}
                  />
                  <MenuItem
                    label="Following"
                    icon={<GoPeople className="mr-2" />}
                    onClick={() => router.push("/dashboard/following")}
                  />
                  <MenuItem
                    label="Profile Settings"
                    icon={<MdSettings className="mr-2" />}
                    onClick={() =>
                      router.push("/dashboard/account-settings/general")
                    }
                  />
                  <div className=" block sm:hidden">
                    <MenuItem
                      label="Home"
                      icon={<GiBarn className="mr-2" />}
                      onClick={() => router.push("/")}
                    />
                  </div>
                </SheetTrigger>
                {user?.role === "CONSUMER" ? (
                  <div>
                    <SheetTrigger className="w-full">
                      <MenuItem
                        icon={<FaStore className="mr-2" />}
                        label="Become a Co-Op"
                        onClick={() => router.push("/auth/become-a-co-op")}
                      />
                      <MenuItem
                        icon={<GiFruitTree className="mr-2" />}
                        label="Become a Producer"
                        onClick={() => router.push("/auth/become-a-producer")}
                      />
                    </SheetTrigger>
                  </div>
                ) : (
                  <></>
                )}
                <hr />
                <div
                  onClick={toggleAbout}
                  className="px-6 
        py-3 
        hover:shadow-md
        font-normal
      text-xl
        md:text-lg
        flex
        items-center
        mi hover:cursor-pointer "
                >
                  <div className="mr-2">
                    <IoInformationCircleOutline className="mr-2" />
                  </div>
                  About <RiArrowDropDownLine className="ml-2" />
                </div>
                {about && (
                  <ul
                    className="px-16  text-xl
        md:text-lg space-y-3"
                  >
                    <li>
                      <Link href="/" className="w-full py-2">
                        About Us
                      </Link>
                    </li>
                    <li className="">
                      <Link href="/info/how-ezh-work" className=" w-full py-2">
                        How EZH Works
                      </Link>
                    </li>
                  </ul>
                )}
                <SheetTrigger className="w-full">
                  <MenuItem
                    icon={<FaSignOutAlt className="mr-2" />}
                    label="Logout"
                    onClick={() => signOut()}
                  />
                  {showInstallBtn &&
                  !window.matchMedia("(display-mode: standalone)").matches ? (
                    <>
                      <Button onClick={() => router.push("/get-ezh-app")}>
                        Install EZH App
                      </Button>{" "}
                    </>
                  ) : (
                    <div></div>
                  )}
                </SheetTrigger>
              </>
            ) : (
              <>
                <Sheet>
                  <SheetTrigger className="w-full">
                    <MenuItem
                      onClick={() => {}}
                      label="Sign Up"
                      icon={<BsPersonPlus className="mr-2" />}
                    ></MenuItem>
                  </SheetTrigger>
                  <SheetContent
                    side="top"
                    className={`${outfit.className} h-screen w-screen d1dbbf text-black  `}
                  >
                    <div className="h-full flex flex-col items-center justify-center px-10">
                      <ul className="w-full max-w-3xl">
                        {[
                          {
                            href: "/auth/register",
                            text: "Sign Up",
                            icon: CiUser,
                          },
                          {
                            href: "/auth/register-co-op",
                            text: ["Become a co-op &", "sell to anyone"],
                            icon: IoStorefrontOutline,
                          },
                          {
                            href: "/auth/register-producer",
                            text: ["Become a grower &", "sell only to co-ops"],
                            icon: GiFruitTree,
                          },
                        ].map((item, index) => (
                          <li
                            key={item.href}
                            className={`w-full ${
                              index === 1
                                ? "border-t-[1px] border-b-[1px] my-10 py-10 border-black"
                                : ""
                            }`}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center justify-between w-full hover:text-neutral-600 hover:italic"
                            >
                              <div className="flex flex-col">
                                {Array.isArray(item.text)
                                  ? item.text.map((line, i) => (
                                      <div key={i}>{line}</div>
                                    ))
                                  : item.text}
                              </div>
                              <item.icon className="text-4xl sm:text-7xl" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-10 text-xs text-black text-center">
                        You can switch your account type to either seller role
                        at any time
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="Sign In"
                    icon={<PiPersonSimpleRunThin className="mr-2" />}
                    onClick={() => {
                      let callbackUrl = window.location.href;
                      const encodedCallbackUrl =
                        encodeURIComponent(callbackUrl);

                      router.push(
                        `/auth/login?callbackUrl=${encodedCallbackUrl}`
                      );
                    }}
                  />
                  <MenuItem
                    label="Market"
                    icon={<CiShop className="mr-2" />}
                    onClick={() => router.push("/market")}
                  />
                  <MenuItem
                    label="Map"
                    icon={<LiaMapMarkedSolid className="mr-2" />}
                    onClick={() => router.push("/map")}
                  />{" "}
                </SheetTrigger>
                <div
                  onClick={toggleAbout}
                  className="px-6 
        py-3 
        hover:shadow-md
        font-normal
        text-xl
        md:text-lg
        flex
        items-center
        mi hover:cursor-pointer "
                >
                  <div className="mr-2">
                    <IoInformationCircleOutline className="mr-2" />
                  </div>
                  About <RiArrowDropDownLine className="ml-2" />
                </div>
                {about && (
                  <ul
                    className="px-16  
   text-xl
        md:text-lg space-y-3"
                  >
                    <li>
                      <Link href="/" className="w-full py-2">
                        About Us
                      </Link>
                    </li>
                    <li className="">
                      <Link href="/info/how-ezh-work" className=" w-full py-2">
                        How EZH Works
                      </Link>
                    </li>
                  </ul>
                )}
                <SheetTrigger className="px-4 pt-3">
                  <Button onClick={() => router.push("/get-ezh-app")}>
                    Install the EZH App
                  </Button>
                </SheetTrigger>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;

const useMediaQuery = (query: any) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: any) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};
