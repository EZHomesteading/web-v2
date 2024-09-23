import Link from "next/link";
import { PiArrowLeftThin } from "react-icons/pi";

//settings page parent element
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Link href="/dashboard/seller">
        <PiArrowLeftThin className="h-12 w-12 absolute top-[0] z left-4 md:hidden" />
      </Link>
      <div className="md:pt-0 pt-4">{children}</div>
    </>
  );
};

export default Layout;
