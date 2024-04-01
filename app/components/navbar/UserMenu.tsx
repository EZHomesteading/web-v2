"use client";

import {
  FaHeart,
  FaStore,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import useListingModal from "@/hooks/useRentModal";

import MenuItem from "./MenuItem";
import { CiSquarePlus } from "react-icons/ci";
import { BsBasket } from "react-icons/bs";
import { UserInfo } from "@/next-auth";

interface UserMenuProps {
  user?: UserInfo;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const listingModal = useListingModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!user) {
      return router.push("/auth/register-producer");
    }
    if (user.role !== "COOP" && user.role !== "PRODUCER") {
      return router.push("/auth/become-a-producer");
    }
    listingModal.onOpen();
  }, [, listingModal, user]);

  return (
    <div className={`relative ${textColor}`}>
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="
                hidden
                md:flex
                items-center
                text-sm 
                font-semibold 
                py-3 
                px-4 
                rounded-full 
                hover:bg-green-100
                hover:shadow-md
                hover:text-green-600 
                transition 
                cursor-pointer"
        >
          Add a Product
        </div>
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
            {user!.firstName}
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
          <div className="flex flex-col cursor-pointer">
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
              <>
                <MenuItem
                  label="Sign In"
                  icon={<FaSignInAlt className="mr-2" />}
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                />
                <MenuItem
                  label="Sign up"
                  icon={<FaUserPlus className="mr-2" />}
                  onClick={() => {
                    router.push("/auth/register");
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
