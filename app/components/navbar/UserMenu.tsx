"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./popover-navbar";
import MenuItem from "./MenuItem";
import NotificationIcon from "./icons/notification";
import CartIcon from "./icons/cart-icon";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavUser } from "@/actions/getUser";
import { iconMap } from "./icon-map";
import placeholder from "@/public/images/website-images/placeholder.jpg";
import axios from "axios";
import { toast } from "sonner";
import { o } from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { IconType } from "react-icons";

type MenuIconItem = IconItem | ComponentItem;

type IconItem = {
  key: string;
  icon: IconType;
  label: string;
  onClick: () => void;
};

type ComponentItem = {
  key: string;
  component: React.ReactNode;
};

interface Props {
  user?: NavUser;
  canReceivePayouts: boolean;
  uniqueUrl: string;
  harvestMessages?: { conversationId: string; lastMessageAt: Date }[];
}

const UserMenu: React.FC<Props> = ({
  user,
  canReceivePayouts,
  uniqueUrl,
  harvestMessages,
}) => {
  const router = useRouter();
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");
  const pathname = usePathname();
  const selling = pathname?.startsWith("/selling");
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);
  const handleCreateClick = async () => {
    if (user?.role === UserRole.CONSUMER) {
      try {
        const [stripeResponse, userUpdateResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/create-connected-account`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user?.id }),
            }
          ),
          axios.post("/api/useractions/update", {
            role: UserRole.PRODUCER,
            hasPickedRole: false,
            url: uniqueUrl,
          }),
        ]);

        if (!stripeResponse.ok) {
          throw new Error(`HTTP error! status: ${stripeResponse.status}`);
        }

        const stripeData = await stripeResponse.json();
        console.log("Stripe connected account created:", stripeData);
        console.log("User role updated successfully:", userUpdateResponse.data);
      } catch (error) {
        console.error("Error in consumer API calls:", error);
        toast.warning(
          "Some account setup steps failed. Please contact support."
        );
      }
    }

    if (
      (user?.hasPickedRole || user?.hasPickedRole === null) &&
      user?.locations?.[0]?.address &&
      user?.locations?.[0]?.hours
      //user?.image &&
      //canReceivePayouts
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

  const renderIcons = () => {
    const icons: MenuIconItem[] = [
      {
        key: "home",
        icon: iconMap.Barn,
        label: "Home",
        onClick: () => router.push("/"),
      },
      {
        key: "map",
        icon: iconMap.PiMapTrifoldThin,
        label: "Map",
        onClick: () => router.push("/map"),
      },
      {
        key: "market",
        icon: iconMap.PiStorefrontThin,
        label: "Market",
        onClick: () => router.push("/market"),
      },
      {
        key: "create",
        icon: iconMap.PiPlusThin,
        label: "Create",
        onClick: handleCreateClick,
      },
    ];

    if (user) {
      if (!isCartEmpty) {
        icons.push({
          key: "cart",
          component: <CartIcon key="cart" cart={user.cart} />,
        });
      }
      if (hasNotifications) {
        icons.push({
          key: "alerts",
          component: (
            <NotificationIcon
              key="alerts"
              sOrders={user.sellerOrders}
              bOrders={user.buyerOrders}
              harvestMessages={harvestMessages}
            />
          ),
        });
      }
    }

    return icons
      .filter(
        (icon) => "component" in icon || (user ? true : icon.key !== "create")
      )
      .slice(0, isMdOrLarger ? 6 : 5)
      .map((icon) => {
        if ("component" in icon) {
          return icon.component;
        } else {
          return (
            <IconWrapper
              key={icon.key}
              icon={icon.icon}
              label={icon.label}
              onClick={icon.onClick}
            />
          );
        }
      });
  };

  return (
    <>
      <Popover>
        <div className="flex flex-row items-center justify-evenly sm:justify-end p-2 min-w-screen gap-x-3 md:gap-x-4">
          {renderIcons()}
          <MenuIcon image={user?.image} />
        </div>
        <PopoverContent
          className={`${o.className} mb-1 w-screen sm:h-fit sm:mt-[.95rem] sm:rounded-xl rounded-none h-[calc(100vh-100px)] py-3 border-y-[1px] border-x-none sm:w-80 md:w-[14rem] text-sm`}
          align="end"
          alignOffset={0}
        >
          {user ? (
            <>
              {selling ? (
                <>
                  <MenuItem
                    label="Today's Obligations"
                    onClick={() => router.push("/selling/todays-obligations")}
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    label="Market"
                    onClick={() => router.push("/market")}
                  />
                  <MenuItem label="Map" onClick={() => router.push("/map")} />
                </>
              )}
              <MenuItem label="Messages" onClick={() => router.push("/chat")} />

              {selling ? (
                <>
                  <MenuItem
                    label="Sale Orders"
                    onClick={() =>
                      router.push("/orders?type=sales&status=active")
                    }
                  />
                  <div className={`border-t w-full my-2`} />
                  <MenuItem
                    label="My Listings"
                    onClick={() => router.push("selling/my-store")}
                  />
                  <MenuItem
                    label="Create New Listing"
                    onClick={() => router.push("/create")}
                  />
                  <div className={`border-t w-full my-2`} />
                  <MenuItem
                    label="Store Settings"
                    onClick={() => router.push("/selling/my-store/settings")}
                  />
                  <MenuItem
                    label="Locations & Hours"
                    onClick={() =>
                      router.push("/selling/availability-calendar")
                    }
                  />
                  <div className={`border-t w-full my-2`} />
                  <MenuItem
                    label="Switch to Buying"
                    onClick={() => router.push("/account")}
                  />
                </>
              ) : (
                <>
                  <div className={`border-t w-full my-2`} />
                  <MenuItem
                    label="Purchase Orders"
                    onClick={() =>
                      router.push("/orders?type=purchases&status=active")
                    }
                  />
                  <MenuItem label="Cart" onClick={() => router.push("/cart")} />
                  <MenuItem
                    label="Account"
                    onClick={() => router.push("/account")}
                  />
                  <div className={`border-t w-full my-2`} />
                  <MenuItem
                    label="Switch to Selling"
                    onClick={() => router.push("/selling")}
                  />
                </>
              )}

              <div className="block sm:hidden">
                <MenuItem label="Home" onClick={() => router.push("/")} />
              </div>
              {user?.role === "CONSUMER" && (
                <div>
                  <MenuItem
                    label="Become a Co-Op"
                    onClick={() => router.push("/auth/become-a-co-op")}
                  />
                  <MenuItem
                    label="Become a Producer"
                    onClick={() => router.push("/auth/become-a-producer")}
                  />
                </div>
              )}
              <div className={`border-t my-2`} />
              <MenuItem label="Sign Out" onClick={() => signOut()} />
              {showInstallBtn &&
                !window.matchMedia("(display-mode: standalone)").matches && (
                  <Button
                    className="w-full"
                    onClick={() => router.push("/get-ezh-app")}
                  >
                    Install EZH App
                  </Button>
                )}
            </>
          ) : (
            <>
              <Sheet>
                <SheetTrigger className="flex justify-between items-center">
                  <MenuItem onClick={() => {}} label="Sign Up" />
                </SheetTrigger>
                <SheetContent
                  className={`${o.className} min-h-screen w-screen d1dbbf `}
                >
                  <div className="h-full flex flex-col items-center justify-center px-10">
                    <ul className="w-full max-w-3xl">
                      {[
                        {
                          href: "/auth/register",
                          text: "Sign Up",
                          icon: iconMap.CiUser,
                        },
                        {
                          href: "/auth/register-co-op",
                          text: ["Become a co-op &", "sell to anyone"],
                          icon: iconMap.IoStorefrontOutline,
                        },
                        {
                          href: "/auth/register-producer",
                          text: ["Become a grower &", "sell only to co-ops"],
                          icon: iconMap.GiFruitTree,
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
                    <div className="pt-10 text-xs  text-center">
                      You can switch your account type to either seller role at
                      any time
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <MenuItem
                label="Sign In"
                onClick={() => {
                  let callbackUrl = window.location.href;
                  const encodedCallbackUrl = encodeURIComponent(callbackUrl);
                  router.push(`/auth/login?callbackUrl=${encodedCallbackUrl}`);
                }}
              />
              <MenuItem label="Market" onClick={() => router.push("/market")} />
              <MenuItem label="Map" onClick={() => router.push("/map")} />
              <Button onClick={() => router.push("/get-ezh-app")}>
                Install the EZH App
              </Button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

const IconWrapper: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      className="flex flex-col pb-4 sm:pb-2 items-center justify-center hover:cursor-pointer"
      onClick={onClick}
    >
      <Icon className={`h-8 w-8  `} />
      <div className={`text-xs ${o.className} `}>{label}</div>
    </button>
  );
};
interface p {
  image: string | null | undefined;
}
const MenuIcon = ({ image }: p) => {
  return (
    <>
      <PopoverTrigger className="flex flex-col items-center sm:hidden hover:cursor-pointer">
        <IconWrapper
          icon={iconMap.CiMenuFries}
          label="Menu"
          onClick={() => {}}
        />
      </PopoverTrigger>
      <PopoverTrigger className="relative shadow-md border-[1px] mb-2 py-1 px-2 rounded-full hidden sm:flex justify-center items-center hover:cursor-pointer">
        <iconMap.IoIosMenu className={`w-8 h-8 mr-1 `} />
        <Image
          src={image || placeholder}
          alt="Profile Image"
          height={25}
          width={25}
          className="object-fit rounded-full"
        />
      </PopoverTrigger>
    </>
  );
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};

export default UserMenu;
