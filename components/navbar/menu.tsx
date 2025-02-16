"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./popover-navbar";
import MenuItem from "./menu-item";
import NotificationIcon from "./icons/notification";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavUser } from "@/actions/getUser";
import { iconMap } from "./icons/icon-map";
import axios from "axios";
import { toast } from "sonner";
import { IconType } from "react-icons";
import { OutfitFont } from "@/components/fonts";
import { IoIosMenu } from "react-icons/io";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

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
  user?: NavUser | null;
  harvestMessages?: { conversationId: string; lastMessageAt: Date }[];
  drawerClassName?: string;
}

const UserMenu: React.FC<Props> = ({
  drawerClassName,
  user,
  harvestMessages,
}) => {
  const router = useRouter();
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");
  const pathname = usePathname();
  const selling = pathname?.startsWith("/selling");
  const MenuIcon = () => {
    return (
      <>
        {isMdOrLarger ? (
          <PopoverTrigger>
            <MenuWrapper icon={IoIosMenu} label="Menu" />
          </PopoverTrigger>
        ) : (
          <DrawerTrigger>
            <MenuWrapper icon={IoIosMenu} label="Menu" />
          </DrawerTrigger>
        )}
      </>
    );
  };

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
            // url: uniqueUrl,
          }),
        ]);

        if (!stripeResponse.ok) {
          throw new Error(`HTTP error! status: ${stripeResponse.status}`);
        }

        const stripeData = await stripeResponse.json();
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
    ) {
      router.push("/create");
    } else {
      router.push("/new-location-and-hours");
    }
  };

  const hasNotifications =
    (user?.sellerOrders?.length ?? 0) > 0 ||
    (user?.buyerOrders?.length ?? 0) > 0;
  // const isCartEmpty = (user?.cart?.length ?? 0) === 0;

  const renderIcons = () => {
    const icons: MenuIconItem[] = [
      {
        key: "chat",
        icon: iconMap.PiChatCircleThin,
        label: "Chat",
        onClick: () => router.push("/chat"),
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
      {isMdOrLarger ? (
        <Popover>
          {renderIcons()}
          <MenuIcon />
          <PopoverContent
            className={`${OutfitFont.className} mb-3 w-screen sm:rounded-xl h-[calc(100vh-80px)] sm:h-fit py-3 border-y-[1px] border-x-none sm:w-80 md:w-[14rem] zmax`}
            align="end"
            alignOffset={-2}
          >
            {user ? (
              <>
                {selling ? (
                  <>
                    <MenuItem
                      label="Sale Orders"
                      onClick={() =>
                        router.push("/orders?type=sales&status=active")
                      }
                    />
                    <MenuItem
                      label="Messages"
                      onClick={() => router.push("/chat")}
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
                    <MenuItem label="Map" onClick={() => router.push("/map")} />
                    <MenuItem
                      label="Market"
                      onClick={() => router.push("/market")}
                    />
                    <MenuItem
                      label="Messages"
                      onClick={() => router.push("/chat")}
                    />
                    <div className={`border-t w-full my-2`} />
                    <MenuItem
                      label="Purchase Orders"
                      onClick={() =>
                        router.push("/orders?type=purchases&status=active")
                      }
                    />
                    <MenuItem
                      label="My Basket"
                      onClick={() => router.push("/my-basket")}
                    />
                    <MenuItem
                      label="My Account"
                      onClick={() => router.push("/account")}
                    />
                    <div className={`border-t w-full my-2`} />
                    <MenuItem
                      label="Switch to Selling"
                      onClick={() => router.push("/selling")}
                    />
                  </>
                )}
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
              </>
            ) : (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <MenuItem onClick={() => {}} label="Sign Up" />
                  </SheetTrigger>
                  <SheetContent
                    className={`${OutfitFont.className} min-h-screen w-screen `}
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
                              index === 1 &&
                              "border-t-[1px] border-b-[1px] my-10 py-10 border-black"
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
                        You can switch your account type to either seller role
                        at any time
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <MenuItem
                  label="Sign In"
                  onClick={() => {
                    let callbackUrl = window.location.href;
                    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
                    router.push(
                      `/auth/login?callbackUrl=${encodedCallbackUrl}`
                    );
                  }}
                />
                <MenuItem
                  label="Market"
                  onClick={() => router.push("/market")}
                />
                <MenuItem label="Map" onClick={() => router.push("/map")} />
              </>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer>
          {renderIcons()}
          <MenuIcon />
          <DrawerContent
            className={`${OutfitFont.className} pb-2 h-[75vh] ${drawerClassName}`}
          >
            {user ? (
              <>
                {selling ? (
                  <>
                    <MenuItem
                      label="Sale Orders"
                      onClick={() =>
                        router.push("/orders?type=sales&status=active")
                      }
                    />
                    <MenuItem
                      label="Messages"
                      onClick={() => router.push("/chat")}
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
                    <MenuItem label="Map" onClick={() => router.push("/map")} />
                    <MenuItem
                      label="Market"
                      onClick={() => router.push("/market")}
                    />
                    <MenuItem
                      label="Messages"
                      onClick={() => router.push("/chat")}
                    />
                    <div className={`border-t w-full my-2`} />
                    <MenuItem
                      label="Purchase Orders"
                      onClick={() =>
                        router.push("/orders?type=purchases&status=active")
                      }
                    />
                    <MenuItem
                      label="My Basket"
                      onClick={() => router.push("/my-basket")}
                    />
                    <MenuItem
                      label="My Account"
                      onClick={() => router.push("/account")}
                    />
                    <div className={`border-t w-full my-2`} />
                    <MenuItem
                      label="Switch to Selling"
                      onClick={() => router.push("/selling")}
                    />
                  </>
                )}
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
              </>
            ) : (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <MenuItem onClick={() => {}} label="Sign Up" />
                  </SheetTrigger>
                  <SheetContent
                    className={`${OutfitFont.className} min-h-screen w-screen `}
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
                              index === 1 &&
                              "border-t-[1px] border-b-[1px] my-10 py-10 border-black"
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
                        You can switch your account type to either seller role
                        at any time
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <MenuItem
                  label="Sign In"
                  onClick={() => {
                    let callbackUrl = window.location.href;
                    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
                    router.push(
                      `/auth/login?callbackUrl=${encodedCallbackUrl}`
                    );
                  }}
                />
                <MenuItem
                  label="Market"
                  onClick={() => router.push("/market")}
                />
                <MenuItem label="Map" onClick={() => router.push("/map")} />
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

const IconWrapper: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      className="flex flex-col pb-4 sm:pb-2 items-center justify-center hover:cursor-pointer"
      onClick={onClick}
    >
      <Icon className={`h-8 w-8  `} />
      <div className={`text-xs ${OutfitFont.className} `}>{label}</div>
    </button>
  );
};
const MenuWrapper: React.FC<{
  icon: React.ElementType;
  label: string;
}> = ({ icon: Icon, label }) => {
  return (
    <div className="flex flex-col pb-4 sm:pb-2 items-center justify-center hover:cursor-pointer">
      <Icon className={`h-8 w-8  `} />
      <div className={`text-xs ${OutfitFont.className} `}>{label}</div>
    </div>
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
