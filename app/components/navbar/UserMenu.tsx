"use client";
//user menu popover component
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { FaComment, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { CiShop, CiSquarePlus, CiUser } from "react-icons/ci";
import { usePathname, useRouter } from "next/navigation";
import { MdDashboard, MdSettings } from "react-icons/md";
import { BsBasket } from "react-icons/bs";
import { GiBarn, GiFruitTree } from "react-icons/gi";
import { UserRole } from "@prisma/client";
import { UpdateRoleAlert } from "../modals/update-role-alert";
import { Outfit } from "next/font/google";
import { GoPeople } from "react-icons/go";
import Avatar from "../Avatar";
import { LiaMapMarkedSolid } from "react-icons/lia";
import NotificationIcon from "../icons/notification";
import CartIcon from "@/app/components/icons/cart-icon";
import { BsPersonPlus } from "react-icons/bs";
import { PiPersonSimpleRunThin } from "react-icons/pi";
import { Button } from "../ui/button";
import { navUser } from "@/next-auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoStorefrontOutline } from "react-icons/io5";

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
  const white = pathname === "/" || pathname?.startsWith("/chat");
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

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
  return (
    <>
      <Sheet>
        <div className="flex flex-row items-center justify-end min-w-screen gap-x-6 md:gap-x-3">
          <GiBarn
            className={`h-8 w-8 block sm:hidden text-white ${
              white ? "text-white" : "text-black"
            }`}
            onClick={() => router.push("/")}
          />
          <CartIcon cart={user?.cart} />

          <NotificationIcon
            sOrders={user?.sellerOrders}
            bOrders={user?.buyerOrders}
          />
          {user ? (
            <>
              <Link href={`/create`}>
                <div
                  className={`${
                    white ? "text-white" : "text-black"
                  } text-xs border rounded-full px-2 py-1 shadow-sm ${
                    outfit.className
                  }`}
                >
                  Add a Product
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/auth/register?callbackUrl=/create`}>
                <div
                  className={`${
                    white ? "text-white" : "text-black"
                  } text-xs border rounded-full px-2 py-1 shadow-sm ${
                    outfit.className
                  }`}
                >
                  Add a Product
                </div>
              </Link>
            </>
          )}

          <SheetTrigger className="border-none p-[2px] rounded-md">
            <AiOutlineMenu
              className={`w-8 h-8 lg:w-8 lg:h-8 ${
                white ? "text-white" : "text-black"
              }`}
            />
          </SheetTrigger>
        </div>
        <SheetContent className={`${outfit.className} bg pt-5 overflow-y-auto`}>
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
                      className={`${outfit.className} h-screen w-screen d1dbbf text-black text-2xl sm:text-4xl md:text-7xl `}
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
                              text: [
                                "Become a grower &",
                                "sell only to co-ops",
                              ],
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
                    <Button onClick={() => router.push("/get-ezh-app")}>
                      Install the EZH App
                    </Button>
                  </SheetTrigger>{" "}
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UserMenu;
