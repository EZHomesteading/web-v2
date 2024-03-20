"use client";

import {
  FaHeart,
  FaShoppingCart,
  FaStore,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import useCoopRegisterModal from "@/app/hooks/useCoopRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";

import MenuItem from "./MenuItem";
import Avatar from "../ui/Avatar";
import { CiSquarePlus } from "react-icons/ci";
import { BsBasket } from "react-icons/bs";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();

  // Custom hooks for managing modal states
  const coopRegisterModal = useCoopRegisterModal();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();

  // State for managing menu open/close
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu open/close
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // Handler for renting a product
  const onRent = useCallback(() => {
    if (!currentUser) {
      // Open login modal if user is not logged in
      return loginModal.onOpen();
    }

    // Open rent modal if user is logged in
    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {/* Add a Product button */}
        {currentUser?.role === "coop" ? (
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
                hover:bg-neutral-100 
                transition 
                cursor-pointer"
          >
            Add a Product
          </div>
        ) : (
          <div
            onClick={coopRegisterModal.onOpen}
            className="
            hidden
            md:flex
            items-center
            text-sm 
            font-semibold 
            py-3 
            px-4 
            rounded-full 
            hover:bg-neutral-100 
            transition 
            cursor-pointer
          "
          >
            Add a Product
          </div>
        )}

        {/* Menu button */}
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
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {/* Menu content */}
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
            {/* Render menu items based on user authentication */}
            {currentUser?.role === "coop" ? (
              <div>
                <MenuItem
                  label="My Store"
                  icon={<FaStore className="mr-2" />}
                  onClick={() => router.push("/dashboard/my-store")}
                />
                <MenuItem
                  label="Add a Product"
                  icon={<CiSquarePlus className="mr-2" />}
                  onClick={rentModal.onOpen}
                />
              </div>
            ) : (
              <div></div>
            )}
            {currentUser ? (
              <>
                <MenuItem
                  label="Profile Settings"
                  icon={<MdSettings className="mr-2" />}
                  onClick={() => router.push("/dashboard")}
                />
                <MenuItem
                  label="My Favorites"
                  icon={<FaHeart className="mr-2" />}
                  onClick={() => router.push("/dashboard/favorites")}
                />
                <MenuItem
                  label="Current Orders"
                  icon={<FaShoppingCart className="mr-2" />}
                  onClick={() => router.push("/dashboard/reservations")}
                />
                <MenuItem
                  label="Cart"
                  icon={<BsBasket className="mr-2" />}
                  onClick={() => router.push("/cart")}
                />
                {currentUser?.role === "" ? (
                  <MenuItem
                    icon={<FaStore className="mr-2" />}
                    label="Become a Co-Op"
                    onClick={() => router.push("/updatetocoop")}
                  />
                ) : (
                  <div></div>
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
                  label="Login"
                  icon={<FaSignInAlt className="mr-2" />}
                  onClick={loginModal.onOpen}
                />
                <MenuItem
                  label="Sign up"
                  icon={<FaUserPlus className="mr-2" />}
                  onClick={registerModal.onOpen}
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
