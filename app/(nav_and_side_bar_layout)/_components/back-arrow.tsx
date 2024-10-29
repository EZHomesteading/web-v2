import Link from "next/link";
import { PiArrowLeftThin } from "react-icons/pi";
// being used in /account and /selling
const BackArrow = ({ nav = "buy" }: { nav?: string }) => {
  let link = "/account";
  if (nav === "sell") link = "/selling";
  return (
    <div className="absolute md:hidden  h-12 w-12 top-0 left-3">
      <Link href={link} className="hover:cursor-pointer">
        <PiArrowLeftThin className="z-10 h-12 w-12 " />
      </Link>
    </div>
  );
};

export default BackArrow;
