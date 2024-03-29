import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import Link from "next/link";

interface NavbarProps {
  user?: any;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="relative w-full z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <FindListingsComponent />
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <div className="flex flex-row justify-evenl space-x-3">
                  <Link href="/auth/login">
                    <div className="border-[.5px] border-neutral-200 px-2 rounded-full cursor-pointer">
                      Sign In
                    </div>
                  </Link>
                  <Link href="/auth/register">
                    <div className="border-[.5px] border-neutral-200 px-2 rounded-full cursor-pointer">
                      Sign Up
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
