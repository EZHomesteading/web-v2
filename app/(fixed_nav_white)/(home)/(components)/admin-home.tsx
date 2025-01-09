//homepage displayed if user role is ADMIN
import Link from "next/link";
import { Button } from "@/components/ui/button";
import getReports from "@/actions/getReports";
import getDisputesLite from "@/actions/getDisputes";
import { UserInfo } from "next-auth";
import { OutfitFont } from "@/components/fonts";

interface Props {
  user: UserInfo;
}

const AdminHome = async ({ user }: Props) => {
  const reports = await getReports();
  const disputes = await getDisputesLite();
  return (
    <main className="h-screen bg-black text-white flex flex-col items-center justify-center w-screen">
      <header className="py-12">
        <h1 className="2xl:text-5xl text-lg font-bold tracking-tight f">
          <div className={`${OutfitFont.className} `}>
            <>
              <span className="text-green-200 tracking font-medium">
                Welcome back,
              </span>
              <span className="text-xl mr-2 font-semibold">, {""}</span>
              <span className="text-green-400 font-bold">
                {user.fullName?.first}.
              </span>
            </>
          </div>
        </h1>
        <div className="flex flex-row justify-center mt-5 text-xs sm:text-sm gap-x-1 sm:gap-x-3">
          <Link href="/dispute" className="relative">
            {disputes.length === 0 ? null : (
              <div className="absolute text-center top-[1px] right-0 text-green bg-red-600 rounded-full w-5 p-[1px] text-xs">
                {disputes.length}
              </div>
            )}
            <Button className="hover:bg-green-100 hover:text-black">
              Disputes
            </Button>
          </Link>
          <Link href="/reports" className="relative">
            {reports.length === 0 ? null : (
              <div className="absolute text-center top-[1px] right-0 text-green bg-red-600 rounded-full w-5 p-[1px] text-xs">
                {reports.length}
              </div>
            )}
            <Button className="hover:bg-green-100 hover:text-black">
              Reports
            </Button>
          </Link>
        </div>
      </header>
    </main>
  );
};

export default AdminHome;
