"use client";

import { useEffect, useState } from "react";
import Container from "../Container";
import Logo from "@/components/navbar/Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/components/listings/search-listings";
import { NavUser } from "@/actions/getUser";
import Categories from "@/app/(nav_market_layout)/market/_components/categories";

interface NavbarProps {
  user?: NavUser;
  apiKey?: string;
  isMarketPage?: boolean;
  isChat?: boolean;
  isHome?: boolean;
  canReceivePayouts: boolean;
  uniqueUrl: string;
  className: string;
  harvestMessages:
    | {
        conversationId: string;
        lastMessageAt: Date;
      }[]
    | undefined;
}

const Navbar = ({
  isChat,
  user,
  apiKey,
  isMarketPage,
  className,
  canReceivePayouts,
  uniqueUrl,
  harvestMessages,
}: NavbarProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 641);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const homeNavClass = `${isChat ? "absolute" : "sticky"} w-full z-10 ${
    className || ""
  } select-none !text-black`;

  const topNavClass = `top-0 left-0 right-0 sm:py-2 md:border-b-[1px] z-10 ${
    isSmallScreen ? "relative" : `sticky ${className}`
  }`;

  const findListingsClass = "py-2 flex justify-center mb-2 w-full max-w-2xl";

  return (
    <>
      {!isSmallScreen ? (
        <div className={homeNavClass}>
          <Container>
            <div className="sm:flex sm:justify-between sm:items-center">
              <Logo />
              {apiKey && isMarketPage && !isSmallScreen && (
                <FindListingsComponent apiKey={apiKey} />
              )}
              <UserMenu
                user={user}
                uniqueUrl={uniqueUrl}
                harvestMessages={harvestMessages}
              />
            </div>
          </Container>
        </div>
      ) : (
        <>
          <div
            className={topNavClass}
            style={{ height: isSmallScreen ? "0px" : "80px" }}
          >
            {!isSmallScreen ? (
              <div className="h-full">
                <div className="container mx-auto h-full">
                  <div className="flex items-center justify-between h-full">
                    <Logo />
                    {isMarketPage && (
                      <div className={findListingsClass}>
                        {apiKey && <FindListingsComponent apiKey={apiKey} />}
                      </div>
                    )}
                    <UserMenu
                      user={user}
                      uniqueUrl={uniqueUrl}
                      harvestMessages={harvestMessages}
                    />
                  </div>
                </div>
              </div>
            ) : (
              isMarketPage && (
                <div className="container mx-auto">
                  <div className={findListingsClass}>
                    {apiKey && <FindListingsComponent apiKey={apiKey} />}
                  </div>
                  <Categories />
                </div>
              )
            )}
          </div>
          {!isSmallScreen && isMarketPage && (
            <div className="container mx-auto mt-4">
              <Categories />
            </div>
          )}
        </>
      )}
      {isSmallScreen && (
        <div
          className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 p-2 z-10 ${className}`}
        >
          <UserMenu
            user={user}
            uniqueUrl={uniqueUrl}
            harvestMessages={harvestMessages}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
