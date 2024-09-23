"use client";
//user menu popover component
import { Popover, PopoverContent, PopoverTrigger } from "./popover-navbar";
import MenuItem from "./MenuItem";
import { FaComment, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { CiMenuFries, CiSettings, CiShop, CiUser } from "react-icons/ci";
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
  PiChartBarLight,
  PiChartBarThin,
  PiChatCircleThin,
  PiHouseThin,
  PiMapTrifoldThin,
  PiPersonSimpleRunThin,
  PiPlusThin,
  PiStorefrontThin,
  PiTreeThin,
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
import { IoIosLogOut, IoIosMenu } from "react-icons/io";
import { UserRole } from "@prisma/client";
import placeholder from "@/public/images/website-images/placeholder.jpg";
import axios from "axios";
import { toast } from "sonner";
const outfit = Outfit({
  subsets: ["latin"],
  display: "auto",
  style: "normal",
  weight: ["100"],
});
interface Props {
  user?: navUser;
  isHome?: boolean;
  canReceivePayouts: boolean;
  uniqueUrl: string;
}
const UserMenu = ({ user, canReceivePayouts, isHome, uniqueUrl }: Props) => {
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
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");
  const toggleAbout = () => {
    setAbout((prevState) => !prevState);
  };
  const handleCreateClickConsumer = async () => {
    try {
      const [stripeResponse, userUpdateResponse] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/create-connected-account`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user?.id }),
          }
        ),
        axios.post("/api/useractions/update", {
          role: UserRole.PRODUCER,
          hasPickedRole: false,
          url: uniqueUrl,
        }),
      ]);

      // Check if the response is ok before trying to parse JSON
      if (!stripeResponse.ok) {
        const textResponse = await stripeResponse.text();
        console.error("Stripe API error response:", textResponse);
        throw new Error(`HTTP error! status: ${stripeResponse.status}`);
      }

      let stripeData;
      try {
        stripeData = await stripeResponse.json();
      } catch (jsonError) {
        console.error("Error parsing Stripe response:", jsonError);
        const textResponse = await stripeResponse.text();
        console.error("Raw Stripe response:", textResponse);
        throw new Error("Invalid JSON in Stripe response");
      }

      console.log("Stripe connected account created:", stripeData);
      if (stripeData && stripeData.stripeAccountId) {
        console.log("Stripe Account ID:", stripeData.stripeAccountId);
      }

      console.log("User role updated successfully:", userUpdateResponse.data);
    } catch (error) {
      console.error("Error in consumer API calls:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      // Log the full error object for debugging
      console.error("Full error object:", error);

      toast.warning("Some account setup steps failed. Please contact support.");
    }
    if (
      (user?.hasPickedRole === true || user?.hasPickedRole === null) &&
      user?.location &&
      user?.location[0]?.address &&
      user?.location[0]?.hours &&
      user?.image &&
      canReceivePayouts === true
    ) {
      router.push("/create");
    } else {
      router.push("/onboard");
    }
  };
  const handleCreateClickSeller = () => {
    console.log(
      user?.hasPickedRole,
      user?.location,
      user?.location[0]?.address,
      user?.location[0]?.hours,
      user?.image,
      canReceivePayouts
    );
    if (
      (user?.hasPickedRole === true || user?.hasPickedRole === null) &&
      user?.location &&
      user?.location[0]?.address &&
      user?.location[0]?.hours &&
      user?.image &&
      canReceivePayouts === true
    ) {
      router.push("/create");
    } else {
      router.push("/onboard");
    }
  };
  const hasNotifications =
    (user?.sellerOrders?.length ?? 0) > 0 ||
    (user?.buyerOrders?.length ?? 0) > 0;

  const isCartEmpty = (user?.cart?.length ?? 0) === 0;
  const IconWrapper: React.FC<{
    icon: any;
    label: string;
    onClick: () => void;
  }> = ({ icon: Icon, label, onClick }) => (
    <div
      className="flex flex-col  pb-4 sm:pb-2 items-center justify-center hover:cursor-pointer"
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
          label="Add Product"
          onClick={() => router.push("/create")}
        />
      );
    } else if (user.role === UserRole.PRODUCER || user.role === UserRole.COOP) {
      if (isMdOrLarger) {
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
            label="Add Product"
            onClick={() => handleCreateClickSeller()}
          />,
          <IconWrapper
            key="dashboard"
            icon={PiChartBarThin}
            label="Dashboard"
            onClick={() => router.push("/dashboard")}
          />
        );
      } else {
        icons.push(
          <IconWrapper
            key="create"
            icon={PiPlusThin}
            label="Add Product"
            onClick={() => handleCreateClickSeller()}
          />,
          <IconWrapper
            key="market"
            icon={PiStorefrontThin}
            label="Market"
            onClick={() => router.push("/market")}
          />
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
            label="Add Product"
            onClick={() => handleCreateClickConsumer()}
          />,
          <IconWrapper
            key="dashboard"
            icon={PiChartBarThin}
            label="Dashboard"
            onClick={() => router.push("/dashboard")}
          />
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
          />
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
              label="Add Product"
              onClick={() => handleCreateClickConsumer()}
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

    icons.push(<MenuIcon key="menu" user={user} />);

    return icons.filter(Boolean).slice(0, 7);
  };

  const MenuIcon: React.FC<{ user?: navUser }> = ({ user }) => (
    <>
      <PopoverTrigger className="flex flex-col items-center sm:hidden hover:cursor-pointer">
        <IconWrapper
          key="menu"
          icon={CiMenuFries}
          label="Menu"
          onClick={() => {}}
        />
      </PopoverTrigger>
      <PopoverTrigger className="relative shadow-md border-[1px] mb-2 py-1 px-2 rounded-full hidden sm:flex justify-center items-center hover:cursor-pointer">
        <IoIosMenu
          className={`w-8 h-8 mr-1 ${
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
      </PopoverTrigger>
    </>
  );
  return (
    <Popover>
      <div className="flex flex-row items-center justify-evenly sm:justify-end pt-2 min-w-screen gap-x-3 md:gap-x-4">
        {renderIcons()}
      </div>
      <PopoverContent
        className={`${outfit.className} mb-1 w-screen h-[calc(100vh-90px)] sm:h-fit sm:w-80 md:w-48 text-sm sm:mt-[.85rem] p-0`}
        align="end"
        alignOffset={0}
      >
        <div>
          <div>
            {user?.role === "COOP" ? (
              <div>
                <MenuItem
                  label="Sell Orders"
                  icon={<FaStore />}
                  onClick={() => router.push("/dashboard/orders/seller")}
                />
              </div>
            ) : user?.role === "PRODUCER" ? (
              <div>
                <MenuItem
                  label="Sell Orders"
                  icon={<FaStore />}
                  onClick={() => router.push("/dashboard/orders/seller")}
                />
              </div>
            ) : (
              <div></div>
            )}
            {user ? (
              <>
                <MenuItem
                  label="Dashboard"
                  icon={<PiChartBarLight />}
                  onClick={() => router.push("/dashboard")}
                />{" "}
                <MenuItem
                  label="Chat"
                  icon={<PiChatCircleThin />}
                  onClick={() => router.push("/chat")}
                />{" "}
                <MenuItem
                  label="Market"
                  icon={<CiShop />}
                  onClick={() => router.push("/market")}
                />
                <MenuItem
                  label="Map"
                  icon={<LiaMapMarkedSolid />}
                  onClick={() => router.push("/map")}
                />
                <MenuItem
                  label="Cart"
                  icon={<BsBasket />}
                  onClick={() => router.push("/cart")}
                />
                <MenuItem
                  label="Following"
                  icon={<GoPeople />}
                  onClick={() => router.push("/dashboard/following")}
                />
                <MenuItem
                  label="Profile Settings"
                  icon={<CiSettings />}
                  onClick={() =>
                    router.push("/dashboard/account-settings/general")
                  }
                />
                <div className=" block sm:hidden">
                  <MenuItem
                    label="Home"
                    icon={<GiBarn />}
                    onClick={() => router.push("/")}
                  />
                </div>
                {user?.role === "CONSUMER" && (
                  <div>
                    <MenuItem
                      icon={<PiStorefrontThin />}
                      label="Become a Co-Op"
                      onClick={() => router.push("/auth/become-a-co-op")}
                    />
                    <MenuItem
                      icon={<PiTreeThin />}
                      label="Become a Producer"
                      onClick={() => router.push("/auth/become-a-producer")}
                    />
                  </div>
                )}
                <hr />
                <MenuItem
                  icon={<IoIosLogOut />}
                  label="Logout"
                  onClick={() => signOut()}
                />
                {showInstallBtn &&
                !window.matchMedia("(display-mode: standalone)").matches ? (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => router.push("/get-ezh-app")}
                    >
                      Install EZH App
                    </Button>{" "}
                  </>
                ) : (
                  <div></div>
                )}
              </>
            ) : (
              <>
                <Popover>
                  <MenuItem
                    onClick={() => {}}
                    label="Sign Up"
                    icon={<BsPersonPlus />}
                  ></MenuItem>
                  <PopoverContent
                    className={`${outfit.className} min-h-screen w-screen d1dbbf text-black  `}
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
                  </PopoverContent>
                </Popover>
                <PopoverTrigger className="w-full">
                  <MenuItem
                    label="Sign In"
                    icon={<PiPersonSimpleRunThin />}
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
                    icon={<CiShop />}
                    onClick={() => router.push("/market")}
                  />
                  <MenuItem
                    label="Map"
                    icon={<LiaMapMarkedSolid />}
                    onClick={() => router.push("/map")}
                  />{" "}
                </PopoverTrigger>
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
                  <div>
                    <IoInformationCircleOutline />
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
                <PopoverTrigger className="px-4 pt-3">
                  <Button onClick={() => router.push("/get-ezh-app")}>
                    Install the EZH App
                  </Button>
                </PopoverTrigger>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
