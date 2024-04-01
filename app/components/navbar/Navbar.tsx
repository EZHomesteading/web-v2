import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import AuthButtons from "./auth-buttons";

interface NavbarProps {
  user?: any;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="relative w-full z-10 shadow-sm">
      <div className="py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <FindListingsComponent />
            {user ? <UserMenu user={user} /> : <AuthButtons />}
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
