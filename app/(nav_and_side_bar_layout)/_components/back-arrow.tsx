import Link from "next/link";
import { PiArrowLeftBold } from "react-icons/pi";

const BackArrow = ({ nav = "buy" }: { nav?: string }) => {
  let link = "/account";
  if (nav === "sell") link = "/selling";
  return (
    <div className={`h-16 fixed top-0 w-screen sheet md:hidden z-50`}>
      <Link
        href={link}
        className="fixed md:hidden top-2 left-1 zmax hover:cursor-pointer w-[calc(100%-.5rem)]"
      >
        <div
          className={`flex items-center rounded-sm py-2 px-3 w-full border `}
        >
          <PiArrowLeftBold className="text-xl" />
          <h1 className={`font-bold text-lg`}>Back</h1>
        </div>
      </Link>
    </div>
  );
};

export default BackArrow;
