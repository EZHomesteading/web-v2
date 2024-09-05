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
    <div className="absolute w-full  ">
      <Container>
        <UserMenu user={user} />
      </Container>
    </div>
  );
};

export default NavbarHome;
