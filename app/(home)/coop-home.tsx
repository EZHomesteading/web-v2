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
            {user?.stripeAccountId || user?.hours || user?.image ? (
              <>
                <span className="text-green-200 tracking font-medium">
                  You&apos;re almost ready to start getting payed out
                </span>
                <span className="text-xl mr-2 font-semibold">, {""}</span>
                <span className="text-green-400 font-bold">
                  {user.firstName}.
                </span>
              </>
            ) : (
              <>
                <span className="text-green-200 tracking font-medium">
                  Congrats on setting up your account
                </span>
                <span className="text-xl mr-2 font-semibold">, {""}</span>
                <span className="text-green-400 font-bold">
                  {user.firstName}.
                </span>
              </>
            )}
          </div>
        </h1>
        <div className="flex flex-row justify-evenly mt-5 text-xs sm:text-sm gap-x-1 sm:gap-x-3">
          <Link href="/shop">
            {" "}
            <Button className="hover:bg-green-100 hover:text-black">
              Shop
            </Button>
          </Link>
          <Link href="/map">
            {" "}
            <Button className="hover:bg-green-100 hover:text-black">
              Find producers nearby
            </Button>
          </Link>
          {user?.stripeAccountId || user?.hours || user?.image ? (
            <StripeButton label="Finish Account Setup" user={user} />
          ) : null}
        </div>
      </header>
    </main>
  );
};

export default CoopHome;
