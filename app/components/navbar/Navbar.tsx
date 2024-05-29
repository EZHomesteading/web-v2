//default navbar parent element
import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import SearchNative from "./search-native";
import { NavUser } from "@/actions/user/getUserNav";

interface p {
  user?: NavUser | null;
}

const Navbar = ({ user }: p) => {
  return (
    <div className="relative w-full z-10 pb-2">
      <div className="py-2 sm:py-4">
        <Container>
          <div className="flex flex-row items-center justify-end sm:justify-center xl:justify-between gap-3 md:gap-0">
            <Logo />
            <div className="hidden xl:block">
              <FindListingsComponent />
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <SearchNative />
              <UserMenu user={user} />
            </div>
          </div>
        </Container>
      </div>
      <Categories user={user} />
    </div>
  );
};

export default Navbar;
