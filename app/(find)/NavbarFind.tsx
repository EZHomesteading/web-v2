import Container from "../components/Container";
import Logo from "../components/navbar/Logo";
import UserMenu from "../components/navbar/UserMenu";
import AuthButtons from "../components/navbar/auth-buttons";

interface NavbarProps {
  user?: any;
}

const NavbarFind = ({ user }: NavbarProps) => {
  return (
    <div className="relative w-full z-10 shadow-sm">
      <div className="py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            {user ? <UserMenu user={user} /> : <AuthButtons />}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NavbarFind;
