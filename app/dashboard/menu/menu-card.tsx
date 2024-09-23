import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
interface p {
  title: string;
  href: string;
  icon: React.ReactNode;
  showDiv?: boolean;
}
const MenuCard = ({ title, href, icon, showDiv = false }: p) => {
  return (
    <>
      <Link
        href={href}
        className="flex items-center hover:cursor-pointer justify-between"
      >
        <div className="flex items-center">
          <div>{icon}</div>
          <div className="ml-1">{title}</div>
        </div>
        <IoIosArrowRoundForward className="h-8 w-8" />
      </Link>
      {showDiv && <div className="border-b py-3" />}
    </>
  );
};

export default MenuCard;
