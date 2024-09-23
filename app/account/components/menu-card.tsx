import Link from "next/link";
import { PiArrowRightThin } from "react-icons/pi";
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
        className={` flex items-center hover:cursor-pointer hover:text-white justify-between pb-3`}
      >
        <div className="flex items-center">
          <div>{icon}</div>
          <div className="ml-1 font-light">{title}</div>
        </div>
        <PiArrowRightThin className={`h-8 w-8`} />
      </Link>
      {showDiv && <hr className="mb-6 mt-3" />}
    </>
  );
};

export default MenuCard;
