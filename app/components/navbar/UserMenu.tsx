"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { FaComment, FaHeart, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { CiShop, CiSquarePlus } from "react-icons/ci";
import { useRouter } from "next/navigation";
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
import { NavUser } from "@/actions/user/getUserNav";

const outfit = Outfit({
  subsets: ["latin"],
  display: "auto",
  style: "normal",
  weight: ["100"],
});
interface Props {
  user?: any;
}
const UserMenu = ({ user }: Props) => {
  const router = useRouter();
  return (
    <Sheet>
      <div className="flex flex-row items-center justify-end min-w-screen gap-x-6 md:gap-x-3">
        <GiBarn
          className="h-9 w-9 block sm:hidden"
          onClick={() => router.push("/")}
        />
        <CartIcon cart={user?.cart} />

        <NotificationIcon
          sOrders={user?.sellerOrders}
          bOrders={user?.buyerOrders}
        />
        {user ? (
          user?.role === UserRole.CONSUMER ? (
            <UpdateRoleAlert
              heading="Would you like to become an EZH producer or co-op?"
              description="You have to be a producer or co-op to add a product. There's no registration fee and and can be done in a few seconds."
              backButtonLabel="No thanks"
              actionButtonLabel="More Info"
              actionButtonHref="/info/ezh-roles"
              actionButtonLabelTwo="Co-op Registration"
              actionButtonHrefTwo="/auth/become-a-co-op"
              actionButtonLabelThree="Producer Registration"
              actionButtonHrefThree="/auth/become-a-producer"
            />
          ) : (
            <div
              onClick={() => {
                router.push("/create");
              }}
              className="hover:cursor-pointer"
            >
              <CiSquarePlus className="w-10 h-10" />
            </div>
          )
        ) : (
          <>
            <UpdateRoleAlert
              heading="Would you like to become an EZH producer or co-op?"
              description="You have to be a producer or co-op to add a product. There's no registration fee and and can be done in a few seconds."
              backButtonLabel="No thanks"
              actionButtonLabel="More Info"
              actionButtonHref="/info/ezh-roles"
              actionButtonLabelTwo="Co-op Registration"
              actionButtonHrefTwo="/auth/register-co-op"
              actionButtonLabelThree="Producer Registration"
              actionButtonHrefThree="/auth/register-producer"
            />
          </>
        )}

        <SheetTrigger className="border-none p-[2px] rounded-md">
          <AiOutlineMenu className="w-8 h-8 lg:w-8 lg:h-8" />
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
                    onClick={() => router.push("/favorites")}
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
                </SheetTrigger>
              </>
            ) : (
              <>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="Sign In"
                    icon={<PiPersonSimpleRunThin className="mr-2" />}
                    onClick={() => router.push("/auth/login")}
                  />
                  <MenuItem
                    label="Sign Up"
                    icon={<BsPersonPlus className="mr-2" />}
                    onClick={() => router.push("/auth/register")}
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
                  />
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
