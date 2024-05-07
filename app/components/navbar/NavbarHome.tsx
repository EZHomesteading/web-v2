import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import AuthButtons from "./auth-buttons";
interface p {
  user?: any;
}
const NavbarHome = ({ user }: p) => {
  return (
    <div className="absolute w-full z-10 text-white">
      <Container>
        <div className="flex flex-row items-center py-4 justify-around md:justify-between">
          <Logo /> {user && <UserMenu user={user} />}
        </div>
        {!user && (
          <div className="flex justify-end">
            <AuthButtons />
          </div>
        )}
      </Container>
    </div>
  );
};

export default NavbarHome;
