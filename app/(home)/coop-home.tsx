"use client";
//homepage displayed if user role is COOP
import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import Link from "next/link";
import StripeButton from "./stripe-onboard";
import { Button } from "../components/ui/button";
import Image from "next/image";
import homebg from "@/public/images/website-images/ezh-bg5.jpg";
import { useRouter } from "next/navigation";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  user: UserInfo;
  canReceivePayouts: boolean;
}

const CoopHome = ({ user, canReceivePayouts }: Props) => {
  const router = useRouter();
  const handleCreateClickSeller = () => {
    if (
      (user?.hasPickedRole === true || user?.hasPickedRole === null) &&
      user?.location &&
      user?.location[0]?.address &&
      user?.location[0]?.hours &&
      user?.image &&
      canReceivePayouts === true
    ) {
      router.push("/create");
    } else {
      router.push("/onboard");
    }
  };
  return (
    <main className="h-screen bg-black text-white px-2 py-2 pt-60 flex flex-col items-center   sm:items-center">
      <div className="absolute inset-0 ">
        <Image
          src={homebg}
          alt="Home Page"
          fill
          className="object-cover 2xl:object-fit"
          sizes="100vw"
        />{" "}
        <div className="absolute inset-0 bg-black bg-opacity-10 "></div>
      </div>
      <header className="py-12 z-[3]">
        <h1 className="2xl:text-5xl text-lg font-bold tracking-tight f">
          <div className={`${outfit.className} `}>
            {!user?.stripeAccountId ||
            user?.location === undefined ||
            !user?.image ? (
              <>
                <span className="text-green-200 tracking font-medium text-xl">
                  You&apos;re almost ready to start getting payed
                </span>
                <span className="text-xl mr-2 font-semibold">, {""}</span>
                <span className="text-green-400 font-bold">{user.name}.</span>
              </>
            ) : (
              <>
                <span className="text-green-200 tracking font-medium text-xl">
                  Congrats on setting up your account
                </span>
                <span className="text-xl mr-2 font-semibold">, {""}</span>
                <span className="text-green-400 font-bold">{user.name}.</span>
              </>
            )}
          </div>
        </h1>
        <div className="flex flex-row justify-center mt-5 text-xs sm:text-sm gap-x-1 sm:gap-x-3">
          <Button
            onClick={handleCreateClickSeller}
            className="hover:underline mr-2"
          >
            List produce
          </Button>

          <Link href="/market">
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
          {!user?.stripeAccountId ||
          user?.location === undefined ||
          !user?.image ? (
            <StripeButton label="Finish Account Setup" user={user} />
          ) : null}
        </div>
      </header>
    </main>
  );
};

export default CoopHome;
