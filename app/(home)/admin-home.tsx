import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import Link from "next/link";
import StripeButton from "./stripe-onboard";
import { Button } from "../components/ui/button";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  user: UserInfo;
}

const CoopHome = ({ user }: Props) => {
  return (
    <main className="h-screen bg-black text-white flex flex-col items-center justify-center w-screen">
      <header className="py-12">
        <h1 className="2xl:text-5xl text-lg font-bold tracking-tight f">
          <div className={`${outfit.className} `}>
            <>
              <span className="text-green-200 tracking font-medium">
                Welcome back,
              </span>
              <span className="text-xl mr-2 font-semibold">, {""}</span>
              <span className="text-green-400 font-bold">
                {user.firstName}.
              </span>
            </>
          </div>
        </h1>
        <div className="flex flex-row justify-center mt-5 text-xs sm:text-sm gap-x-1 sm:gap-x-3">
          <Link href="/dispute">
            <Button className="hover:bg-green-100 hover:text-black">
              Disputes
            </Button>
          </Link>
        </div>
      </header>
    </main>
  );
};

export default CoopHome;
