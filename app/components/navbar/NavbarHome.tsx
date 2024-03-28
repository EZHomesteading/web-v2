import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";

interface NavbarProps {
  user?: any;
}

const NavbarHome = ({ user }: NavbarProps) => {
  return (
    <div className="absolute w-full z-10">
      <Container>
        <div className="flex flex-row items-center justify-between py-4">
          <Logo />
          <UserMenu user={user} />
        </div>
      </Container>
    </div>
  );
};

export default NavbarHome;
