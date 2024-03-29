import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { Outfit } from "next/font/google";
import Link from "next/link";

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
    <div className="absolute w-full z-10">
      <Container>
        <div className="flex flex-row items-center justify-between py-4">
          <Logo />{" "}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <div className="flex flex-row justify-evenl space-x-3">
                <Link href="/auth/login">
                  <div className="border-[.5px] border-neutral-200 px-2 rounded-full cursor-pointer">
                    Sign In
                  </div>
                </Link>
                <Link href="/auth/register">
                  <div className="border-[.5px] border-neutral-200 px-2 rounded-full cursor-pointer">
                    Sign Up
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NavbarHome;
