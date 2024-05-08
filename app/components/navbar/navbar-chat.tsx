import Link from "next/link";
import Container from "../Container";
import UserMenu from "./UserMenu";
import AuthButtons from "./auth-buttons";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  weight: ["100"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface p {
  user?: any;
}
const Navbar = ({ user }: p) => {
  return (
    <div className="relative w-full z-10 pb-2">
      <Container>
        <div className="flex flex-row items-center py-4 justify-around md:justify-between">
          <div
            className={`hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 text-grey hidden xl:block text-white`}
          >
            <Link href="/">
              <h1 className={`${outfit.className} hover:text-green-800`}>
                EZ Homesteading
              </h1>
            </Link>
          </div>
          {user && <UserMenu user={user} />}
          {!user && (
            <div className="flex justify-end text-white">
              <div
                className={`flex flex-row justify-evenly space-x-3 text-xs lg:text-lg `}
              >
                <Link
                  href="/auth/login"
                  className="border-[1px] border-neutral-200 px-2 rounded-full cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="border-[1px] border-neutral-200 px-2 rounded-full cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
