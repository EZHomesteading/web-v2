import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { Outfit } from "next/font/google";
import AuthButtons from "./auth-buttons";

interface NavbarProps {
  user?: any;
}
const outfit = Outfit({
  weight: ["100"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const NavbarHome = ({ user }: NavbarProps) => {
  return (
    <div className="absolute w-full z-10 text-white">
      <Container>
        <div className="flex flex-row items-center justify-between py-4">
          <Logo /> {user ? <UserMenu user={user} /> : <AuthButtons />}
        </div>
      </Container>
    </div>
  );
};

export default NavbarHome;
