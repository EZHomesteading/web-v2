import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user?: any;
}

const Navbar = ({ user }: NavbarProps) => {
  // const pathname = usePathname();

  // if (pathname?.startsWith(`/conversations`)) {
  //   return null;
  // }
  // if (pathname?.startsWith(`/autochat`)) {
  //   return null;
  // }
  // if (pathname === "/messenger") {
  //   return null;
  // }

  return (
    <div className="relative w-full z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
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
