"use client";

import { useEffect, useState } from "react";
import Categories from "./Categories";
import Container from "../Container";
import Logo from "@/app/components/navbar/Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import { navUser } from "@/next-auth";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { UserRole } from "@prisma/client";
import { MdDashboard, MdOutlinePrivacyTip } from "react-icons/md";
import { CgCommunity } from "react-icons/cg";
import { FaOpencart } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { PiCookieThin, PiStorefrontThin } from "react-icons/pi";
import { TbShoppingCartDollar } from "react-icons/tb";
import { VscHistory } from "react-icons/vsc";
import { LiaCartArrowDownSolid } from "react-icons/lia";
import { Button } from "../ui/button";
import Link from "next/link";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}

interface NavbarProps {
  user?: navUser;
  apiKey?: string;
  isDashboard?: boolean;
  isMarketPage?: boolean;
  isChat?: boolean;
  isHome?: boolean;
  canReceivePayouts: boolean;
  uniqueUrl: string;
  seller?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({
  user,
  apiKey,
  isDashboard = false,
  isMarketPage = false,
  isChat = false,
  isHome = false,
  seller = false,
  canReceivePayouts,
  uniqueUrl,
}: NavbarProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768 && window.innerHeight < 4200);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const renderHomeNav = () => (
    <div className="absolute w-full z-[10] bg-emerald-950/70">
      <Container>
        <div className="sm:flex sm:justify-between sm:items-center">
          <Logo />
          <UserMenu
            user={user}
            isHome={true}
            canReceivePayouts={canReceivePayouts}
            uniqueUrl={uniqueUrl}
          />
        </div>{" "}
      </Container>
    </div>
  );
  const link = seller ? "/dashboard/seller" : "/dashboard/menu";
  const renderSwitchButton = () => (
    <Link href={link}>
      <Button
        className="bg-inherit rounded-full shadow-sm text-lg font-normal hover:shadow-emerald-100 hover:bg-inherit mr-2"
        variant="outline"
      >
        {seller ? "Switch to Buying" : "Switch to Selling"}
      </Button>
    </Link>
  );
  return (
    <>
      {isHome && !isSmallScreen ? (
        renderHomeNav()
      ) : (
        <>
          <div
            className={`fixed top-0 left-0 right-0 sm:py-2 
                !bg-inherit md:border-b-[1px] z-10`}
            style={{ height: isSmallScreen ? "0px" : "80px" }}
          >
            {!isSmallScreen ? (
              <div className="h-full">
                <div className="container mx-auto h-full">
                  <div className="flex items-center justify-between h-full">
                    <Logo />

                    {isMarketPage && (
                      <div className="py-2">
                        <div className="flex justify-center mb-2">
                          <div className="w-full max-w-2xl">
                            {apiKey && (
                              <FindListingsComponent apiKey={apiKey} />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {!isSmallScreen && isDashboard && renderSwitchButton()}
                    <UserMenu
                      user={user}
                      canReceivePayouts={canReceivePayouts}
                      uniqueUrl={uniqueUrl}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {isMarketPage && (
                  <div className="container mx-auto">
                    <div className="py-2">
                      <div className="flex justify-center mb-2">
                        <div className="w-full">
                          {apiKey && <FindListingsComponent apiKey={apiKey} />}
                        </div>
                      </div>
                      <Categories user={user} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {!isSmallScreen && isMarketPage && (
            <div className="container mx-auto mt-4">
              <Categories user={user} />
            </div>
          )}
        </>
      )}
      {isSmallScreen && (
        <div
          className={`fixed bottom-0 left-0 right-0 bg-inherit border-t border-gray-200 p-2 z-10 ${
            isHome ? "!bg-emerald-950/70" : "bg-white"
          } `}
        >
          <UserMenu
            user={user}
            canReceivePayouts={canReceivePayouts}
            uniqueUrl={uniqueUrl}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
