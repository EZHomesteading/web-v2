import { Outfit } from "next/font/google";
import Link from "next/link";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
export default function NotFound() {
  return (
    <div
      className={`${outfit.className} flex flex-col h-[100vh] d1dbbf items-center justify-start pt-[15%]`}
    >
      <div className="text-center">
        <h1 className="text-[7rem] font-bold">Oops</h1>
        <h2 className="text-xl mb-8">404 - This page could not be found.</h2>
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 border w-[100px] text-white rounded"
          >
            Home
          </Link>
          <Link
            href="/market"
            className="px-4 w-[100px] py-2 border text-white rounded "
          >
            Market
          </Link>{" "}
          <Link
            href="/chat"
            className="px-4 py-2 border w-[100px] text-white rounded "
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
