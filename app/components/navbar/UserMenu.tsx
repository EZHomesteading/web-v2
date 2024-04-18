"use client";

import {
  FaHeart,
  FaStore,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaComment,
} from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import useListingModal from "@/hooks/use-listing-modal";
import { UpdateRoleAlert } from "../modals/update-role-alert";
import MenuItem from "./MenuItem";
import { CiSquarePlus } from "react-icons/ci";
import { BsBasket } from "react-icons/bs";
import { UserInfo } from "@/next-auth";

interface UserMenuProps {
  user?: UserInfo;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const listingModal = useListingModal();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  function handleClick() {
    setIsOpen(false);
    setTimeout(() => {
      document.removeEventListener("click", handleClick);
    }, 0);
  }
  if (isOpen === true) {
    document.addEventListener("click", handleClick);
  }
  return (
    <div className={`relative `}>
      <div className="flex flex-row items-center gap-3">
        {user?.role !== "COOP" && user?.role !== "PRODUCER" ? (
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
            <div className="block sm:hidden">
              <CiSquarePlus />
            </div>
            <div className="hidden sm:block">Add a Product</div>
          </div>
        )}
        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
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
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div
            className={
              pathname === "/"
                ? `flex flex-col cursor-pointer bg-black`
                : `flex flex-col cursor-pointer bg-white`
            }
          >
            {user?.role === "COOP" ? (
              <div>
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
              </div>
            ) : user?.role === "PRODUCER" ? (
              <div>
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
              </div>
            ) : (
              <div></div>
            )}
            {user ? (
              <>
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
                {user?.role === "CONSUMER" ? (
                  <div>
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
                  </div>
                ) : (
                  <></>
                )}
                <hr />
                <MenuItem
                  icon={<FaSignOutAlt className="mr-2" />}
                  label="Logout"
                  onClick={() => signOut()}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
