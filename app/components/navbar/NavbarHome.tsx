//homepage default navbar
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
interface p {
  user?: any;
}
const NavbarHome = ({ user }: p) => {
  return (
    <div className="absolute w-full z-10 ">
      <Container>
        <div className="flex flex-row items-center py-4 justify-around md:justify-between">
          <Logo /> <UserMenu user={user} />
        </div>
      </Container>
    </div>
  );
};

export default NavbarHome;
