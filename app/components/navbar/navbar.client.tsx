'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import { NavUser } from "@/actions/getUser";
import { navUser } from "@/next-auth";

interface p {
  user?: NavUser | null;
  apiKey: string
}

const Navbar = ({ user, apiKey }: p) => {
  const pathname = usePathname();
  const showSearchBar = pathname?.startsWith('/market');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 600 && window.innerHeight < 900);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="relative w-full z-10 pb-2">
      <div className="py-2 sm:py-4">
        <Container>
          <div className="flex items-center">
            <div className="hidden sm:block">
              <Logo />
            </div>
            <div className="flex flex-col sm:flex-row w-full">
              {!isSmallScreen && <UserMenu user={user as unknown as navUser} />}
              {showSearchBar && (
                <div className="flex justify-center w-full mt-1">
                  <FindListingsComponent apiKey={apiKey} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
      <Categories user={user as unknown as navUser} />
      {isSmallScreen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
          <UserMenu user={user as unknown as navUser} />
        </div>
      )}
    </div>
  );
};

export default Navbar;