"use client";
//homepage displayed if user role is PRODUCER
import { Outfit } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import homebg from "@/public/images/website-images/ezh-bg5.jpg";
import { useRouter } from "next/navigation";
import { UserInfo } from "next-auth";
import { outfitFont } from "@/components/fonts";

interface Props {
  user: UserInfo;
  canReceivePayouts: boolean;
}

const ProducerHome = ({ user, canReceivePayouts }: Props) => {
  const router = useRouter();
  // const handleCreateClickSeller = () => {
  //   if (
  //     (user?.hasPickedRole === true || user?.hasPickedRole === null) &&
  //     user?.location &&
  //     user?.location[0]?.address &&
  //     user?.location[0]?.hours &&
  //     user?.image &&
  //     canReceivePayouts === true
  //   ) {
  //     router.push("/create");
  //   } else {
  //     router.push("/onboard");
  //   }
  // };
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
        <h1 className="2xl:text-5xl text-3xl font-bold tracking-tight f">
          <div className={`${outfitFont.className} `}>
            <span className="text-green-200 tracking font-medium">
              Ready to get started
            </span>
            <span className="text-xl mr-2 font-semibold">, {""}</span>
            <span className="text-green-400 font-bold">
              {user.fullName?.first}?
            </span>
          </div>
        </h1>
        <div className="flex flex-row justify-evenly  text-sm mt-5 ">
          <Button
            // onClick={handleCreateClickSeller}
            className="hover:underline mr-2"
          >
            List produce
          </Button>

          <Link href="/market">
            {" "}
            <Button className="hover:underline mr-2">Market</Button>
          </Link>
          <Link href="/map">
            {" "}
            <Button className="hover:underline">Find co-ops nearby</Button>
          </Link>
        </div>
      </header>
    </main>
  );
};

export default ProducerHome;
