//homepage default navbar
import { navUser } from "@/next-auth";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
interface p {
  user?: navUser;
}
const NavbarHome = ({ user }: p) => {
  return (
    <div className="absolute w-full z-10 ">
      <Container>
        <div className="flex flex-row items-center py-4 justify-end sm:justify-between ">
          <Logo /> <UserMenu user={user} />
        </div>
      </Container>
    </div>
  );
};

export default NavbarHome;
