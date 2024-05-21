import { NavUser } from "@/actions/user/getUserNav";
import Container from "@/app/components/Container";
import Logo from "@/app/components/navbar/Logo";
import UserMenu from "@/app/components/navbar/UserMenu";
import { UserInfo } from "@/next-auth";

interface NavbarProps {
  user?: NavUser | null;
}

const NavbarFind = ({ user }: NavbarProps) => {
  return (
    <div className="relative w-full z-10 shadow-sm h-[64px]">
      <div className="py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <UserMenu user={user} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NavbarFind;
