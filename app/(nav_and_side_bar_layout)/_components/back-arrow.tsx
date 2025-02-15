import Link from "next/link";
import { PiArrowLeftThin } from "react-icons/pi";

const BackArrow = ({ nav = "buy" }: { nav?: string }) => {
  let link = "/account";
  if (nav === "sell") link = "/selling";
  return (
    <Link
      href={link}
      className="absolute md:hidden top-3 left-3 hover:cursor-pointer w-full"
    >
      <div className={`flex items-center rounded-sm py-2 px-3 w-full border`}>
        <PiArrowLeftThin className="text-sm" />
        <h1>Back</h1>
      </div>
    </Link>
  );
};

export default BackArrow;
