import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import AuthButtons from "./auth-buttons";
import { UserInfo } from "@/next-auth";

interface NavbarProps {
  user?: UserInfo;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="relative w-full z-10">
      <div className="py-1 sm:py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <div className="hidden sm:block">
              <FindListingsComponent />
            </div>
            {/* className="flex justify-end items-center w-full" */}
            <div>{user ? <UserMenu user={user} /> : <AuthButtons />}</div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
