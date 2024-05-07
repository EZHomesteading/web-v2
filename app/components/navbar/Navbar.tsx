import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import AuthButtons from "./auth-buttons";
import SearchNative from "./search-native";
interface p {
  user?: any;
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
              {user ? <UserMenu user={user} /> : <AuthButtons />}
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
