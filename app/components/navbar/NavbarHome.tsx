import { UserInfo } from "@/next-auth";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import AuthButtons from "./auth-buttons";

interface NavbarProps {
  user?: UserInfo;
}

const NavbarHome = ({ user }: NavbarProps) => {
  return (
    <div className="absolute w-full z-10 text-white">
      <Container>
        <div className="flex flex-row items-center justify-end sm:justify-between py-4">
          <Logo /> {user ? <UserMenu user={user} /> : <AuthButtons />}
        </div>
      </Container>
    </div>
  );
};

export default NavbarHome;
