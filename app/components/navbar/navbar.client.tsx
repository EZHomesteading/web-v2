"use client";

import { useEffect, useState } from "react";
import Categories from "./Categories";
import Container from "../Container";
import Logo from "@/app/components/navbar/Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import { navUser } from "@/next-auth";

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
  harvestMessages:
    | {
        conversationId: string;
        lastMessageAt: Date;
      }[]
    | undefined;
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
            harvestMessages={harvestMessages}
          />
        </div>{" "}
      </Container>
    </div>
  );

  return (
    <>
      {isHome && !isSmallScreen ? (
        renderHomeNav()
      ) : (
        <>
          <div
            className={` top-0 left-0 right-0 sm:py-2 
                 md:border-b-[1px] z-10 ${
                   isMarketPage && !isSmallScreen
                     ? "bg-white sticky"
                     : isChat && !isSmallScreen
                     ? "sticky"
                     : "!bg-inherit relative"
                 }`}
            style={{ height: isSmallScreen ? "0px" : "80px" }}
          >
            {!isSmallScreen ? (
              <div className="h-full">
                <div className="container mx-auto h-full">
                  <div className="flex items-center justify-between h-full">
                    <Logo />

                    {isMarketPage && (
                      <div className="py-2 ">
                        <div className="flex justify-center mb-2">
                          <div className="w-full max-w-2xl">
                            {apiKey && (
                              <FindListingsComponent apiKey={apiKey} />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <UserMenu
                      user={user}
                      canReceivePayouts={canReceivePayouts}
                      uniqueUrl={uniqueUrl}
                      harvestMessages={harvestMessages}
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
            isHome ? "!bg-emerald-950/70" : "bg-inherit"
          } `}
        >
          <UserMenu
            user={user}
            canReceivePayouts={canReceivePayouts}
            uniqueUrl={uniqueUrl}
            harvestMessages={harvestMessages}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
