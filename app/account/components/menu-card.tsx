import Link from "next/link";
import { PiArrowCircleRightThin } from "react-icons/pi";
interface p {
  title?: string;
  href: string;
  icon: React.ReactNode;
  showDiv?: boolean;
  name: string;
}
const MenuCard = ({ title = "", href, icon, name, showDiv = false }: p) => {
  return (
    <>
      {title && (
        <div className="text-xl pb-3 border-b font-normal ">{title}</div>
      )}
      <Link
        href={href}
        className={` ${
          title && "pt-3"
        } flex items-center hover:cursor-pointer hover:text-white justify-between pb-3`}
      >
        <div className="flex items-center">
          <div>{icon}</div>
          <div className="ml-1 font-light">{name}</div>
        </div>
        <PiArrowCircleRightThin className={`h-8 w-8`} />
      </Link>
      {showDiv && <div className="mb-3 mt-3" />}
    </>
  );
};

export default MenuCard;
