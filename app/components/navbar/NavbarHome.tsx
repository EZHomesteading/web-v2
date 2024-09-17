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
    <div className="absolute w-full z bg-emerald-950/70">
      <Container>
        <div className="sm:flex sm:justify-between sm:items-center">
          <Logo />
          <UserMenu user={user} isHome={true} />
        </div>{" "}
      </Container>
    </div>
  );
};

export default NavbarHome;
