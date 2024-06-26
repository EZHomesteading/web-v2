//chat navbar parent component
import Link from "next/link";
import Container from "../Container";
import UserMenu from "./UserMenu";
import { Outfit } from "next/font/google";
import { navUser } from "@/next-auth";

const outfit = Outfit({
  weight: ["100"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface p {
  user?: navUser;
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
          <UserMenu user={user} />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
