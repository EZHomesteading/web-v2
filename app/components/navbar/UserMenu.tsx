"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { UserInfo } from "@/next-auth";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { FaComment, FaHeart, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { CiSquarePlus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import useRentModal from "@/hooks/modal/use-listing-modal";
import { MdSettings } from "react-icons/md";
import { BsBasket } from "react-icons/bs";
import { GiBarn } from "react-icons/gi";
import useSearchModal from "@/hooks/modal/useSearchModal";
import { BiSearch } from "react-icons/bi";
import { UserRole } from "@prisma/client";
import { UpdateRoleAlert } from "../modals/update-role-alert";
interface Props {
  user: UserInfo;
}
const UserMenu = ({ user }: Props) => {
  const router = useRouter();
  const listingModal = useRentModal();
  const searchModal = useSearchModal();
  return (
    <Sheet>
      <div className="flex flex-row items-center justify-end">
        <div className="block sm:hidden">
          <div
            onClick={() => {
              searchModal.onOpen();
            }}
            className="hover:shadow-md hover:bg-green-100 hover:text-green-950 transition p-4 md:py-1 md:px-2 flex items-center gap-3 rounded-full cursor-pointer text-sm"
          >
            <BiSearch className="text-sm sm:text-md md:text-2xl" />
          </div>
        </div>
        {user?.role !== UserRole.COOP && user?.role != UserRole.PRODUCER ? (
          <UpdateRoleAlert
            heading="Would you like to become an EZH producer or co-op?"
            description="You have to be a producer or co-op to add a product. There's no fee and and can be done in a few seconds."
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
            className="hover:shadow-md hover:bg-green-100 hover:text-green-950 transition p-4 md:py-1 md:px-2 flex items-center gap-3 rounded-full cursor-pointer text-sm"
          >
            <CiSquarePlus className="text-sm sm:text-md md:text-2xl" />
          </div>
        )}
        <SheetTrigger>
          <div
            className="
          p-2
          md:px-2
          sm:border-[1px] 
          sm:border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
          >
            <AiOutlineMenu />
            <div className="hidden md:flex items-center text-sm font-semibold">
              {user?.firstName ? user?.firstName : user?.name}
            </div>
          </div>
        </SheetTrigger>
      </div>
      <SheetContent className="bg-white w-full ">
        <div>
          <div>
            {user?.role === "COOP" ? (
              <div>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="My Store"
                    icon={<FaStore className="mr-2" />}
                    onClick={() => router.push("/dashboard/my-store")}
                  />
                  <MenuItem
                    label="Add a Product"
                    icon={<CiSquarePlus className="mr-2" />}
                    onClick={listingModal.onOpen}
                  />
                </SheetTrigger>
              </div>
            ) : user?.role === "PRODUCER" ? (
              <div>
                <SheetTrigger className="w-full">
                  <MenuItem
                    label="My Store"
                    icon={<FaStore className="mr-2" />}
                    onClick={() => router.push("/dashboard/my-store")}
                  />
                  <MenuItem
                    label="Add a Product"
                    icon={<CiSquarePlus className="mr-2" />}
                    onClick={listingModal.onOpen}
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
                    label="Profile Settings"
                    icon={<MdSettings className="mr-2" />}
                    onClick={() => router.push("/dashboard")}
                  />
                  <MenuItem
                    label="Cart"
                    icon={<BsBasket className="mr-2" />}
                    onClick={() => router.push("/cart")}
                  />
                  <MenuItem
                    label="My Favorites"
                    icon={<FaHeart className="mr-2" />}
                    onClick={() => router.push("/dashboard/favorites")}
                  />
                  <MenuItem
                    label="Chat"
                    icon={<FaComment className="mr-2" />}
                    onClick={() => router.push("/autochat")}
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
