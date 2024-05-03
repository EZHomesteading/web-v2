import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import AuthButtons from "./auth-buttons";
import SearchNative from "./search-native";
import GetOrderNotificationInfo from "@/actions/user/getOrderNotificationInfo";

const Navbar = async () => {
  const user = await GetOrderNotificationInfo();

  return (
    <div className="relative w-full z-10">
      <div className="py-1 sm:py-4">
        <Container>
          <div className="flex flex-row items-center justify-end sm:justify-between gap-3 md:gap-0">
            <Logo />
            <div className="hidden sm:block">
              <FindListingsComponent />
            </div>
            <SearchNative />
            <div>{user ? <UserMenu user={user} /> : <AuthButtons />}</div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
