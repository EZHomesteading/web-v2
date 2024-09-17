"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import { NavUser } from "@/actions/getUser";
import { navUser } from "@/next-auth";

interface p {
  user?: NavUser | null;
  apiKey: string;
  canReceivePayouts: boolean;
  uniqueUrl: string;
}

const Navbar = ({ user, apiKey, canReceivePayouts, uniqueUrl }: p) => {
  const pathname = usePathname();
  const isMarketPage = pathname?.startsWith("/market");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 600 && window.innerHeight < 900);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="z-[100]">
      <div className="fixed top-0 left-0 right-0 bg-white z-[10]">
        {!isSmallScreen ? (
          // Layout for screens 600px and above
          <div>
            <Container>
              <div className="flex items-center justify-between pt-2">
                <Logo />
                <UserMenu
                  user={user as unknown as navUser}
                  canReceivePayouts={canReceivePayouts}
                  uniqueUrl={uniqueUrl}
                />
              </div>
            </Container>
            {isMarketPage && (
              <div className="w-full relative border-b-[1px] py-6">
                <div className="flex justify-center">
                  <FindListingsComponent apiKey={apiKey} />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Small screen layout (below 600px)
          <Container>
            <div className="py-2">
              {isMarketPage && (
                <>
                  <div className="flex justify-center mb-2">
                    <div className="w-full max-w-2xl">
                      <FindListingsComponent apiKey={apiKey} />
                    </div>
                  </div>
                  <Categories user={user as unknown as navUser} />
                </>
              )}
            </div>
          </Container>
        )}
      </div>

      {/* Spacer to prevent content from being hidden under the fixed navbar */}
      <div
        className={`${isSmallScreen ? "h-16" : isMarketPage ? "h-32" : "h-20"}`}
      />

      {isSmallScreen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
          <UserMenu
            user={user as unknown as navUser}
            canReceivePayouts={canReceivePayouts}
            uniqueUrl={uniqueUrl}
          />
        </div>
      )}

      {!isSmallScreen && isMarketPage && (
        <div className="mt-10">
          <Categories user={user as unknown as navUser} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
