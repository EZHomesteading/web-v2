import Link from "next/link";
import { PiArrowLeftThin } from "react-icons/pi";

const BackArrow = () => {
  return (
    <div className="absolute md:hidden  h-12 w-12 top-0 left-3">
      <Link href="/account" className="hover:cursor-pointer">
        <PiArrowLeftThin className="z-10 h-12 w-12 " />
      </Link>
    </div>
  );
};

export default BackArrow;
