//homepage displayed if user role is PRODUCER
import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { Button } from "../components/ui/button";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  user: UserInfo;
}

const ProducerHome = ({ user }: Props) => {
  return (
    <main className="h-screen bg-black text-white flex flex-col items-center justify-center w-screen">
      <header className="py-12">
        <h1 className="2xl:text-5xl text-lg font-bold tracking-tight f">
          <div className={`${outfit.className} `}>
            <span className="text-green-200 tracking font-medium">
              Ready to get started
            </span>
            <span className="text-xl mr-2 font-semibold">, {""}</span>
            <span className="text-green-400 font-bold">{user.firstName}?</span>
          </div>
        </h1>
        <div className="flex flex-col justify-evenly text-sm mt-5 ">
          <Link href="/create">
            {" "}
            <Button className="hover:underline">List produce</Button>
          </Link>
          <Link href="/market">
            {" "}
            <Button className="hover:underline">Market</Button>
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
