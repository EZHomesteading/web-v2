"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { FaComment, FaHeart, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { CiShop, CiSquarePlus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import useRentModal from "@/hooks/modal/use-listing-modal";
import { MdDashboard, MdSettings } from "react-icons/md";
import { BsBasket } from "react-icons/bs";
import { GiBarn } from "react-icons/gi";
import { UserRole } from "@prisma/client";
import { UpdateRoleAlert } from "../modals/update-role-alert";
import { Outfit } from "next/font/google";
import { GoPeople } from "react-icons/go";
import Avatar from "../Avatar";
import { LiaMapMarkedSolid } from "react-icons/lia";
import NotificationIcon from "../icons/notification";
import CartIcon from "../icons/cart-icon";
import { navUser } from "@/next-auth";
const outfit = Outfit({
  subsets: ["latin"],
  display: "auto",
  style: "normal",
  weight: ["100"],
});
interface Props {
  user: any;
}
const UserMenu = ({ user }: Props) => {
  const router = useRouter();
  const listingModal = useRentModal();
  return (
    <Sheet>
      <div className="flex flex-row items-center justify-around min-w-screen gap-x-6 md:gap-x-3">
        <GiBarn
          className="h-9 w-9 block sm:hidden"
          onClick={() => router.push("/")}
        />
        <CartIcon cart={user?.cart} />

        <NotificationIcon
          sOrders={user?.sellerOrders}
          bOrders={user?.buyerOrders}
        />
        {user?.role !== UserRole.COOP && user?.role != UserRole.PRODUCER ? (
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
              listingModal.onOpen();
            }}
          >
            <CiSquarePlus className="w-10 h-10" />
          </div>
        )}
        <SheetTrigger className="border-[1px] p-[2px] rounded-md">
          <AiOutlineMenu className="w-8 h-8 lg:w-8 lg:h-8" />
        </SheetTrigger>
      </div>
      <SheetContent className={`${outfit.className} bg pt-5 overflow-y-auto`}>
        <div>
          <div className="flex flex-row px-4">
            <Avatar user={user} />
            <div className="flex flex-col ml-2">
              <div className="font-bold">{user?.name}</div>
              <div>{user?.firstName}</div>
            </div>
          </div>
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
                        icon={<FaStore className="mr-2" />}
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
              <></>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
