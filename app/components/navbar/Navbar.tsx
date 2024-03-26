import { ExtendedUser } from "@/next-auth";
import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";

interface UserInfoProps {
  user?: ExtendedUser;
}

const Navbar = ({ user }: UserInfoProps) => {
  return (
    <div className="relative w-full z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-betweengap-3 md:gap-0">
            <Logo />
            <FindListingsComponent />
            <UserMenu user={user} />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
