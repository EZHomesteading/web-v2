import { Outfit } from "next/font/google";
import Image from "next/image";
import logo from "@/public/images/website-images/ezh-logo-no-text.png";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const Page = () => {
  return (
    <div className=" w-screen h-screen flex items-center justify-center">
      <div
        className={`${outfit.className} flex sheet flex-col justify-start items-stretch phone px-2 py-2 rounded-lg w-80`}
      >
        <header className="text-2xl flex flex-row items-center">
          <Image src={logo} alt="EZHomesteading Logo" width={50} height={50} />
          EZHomesteading
        </header>
        <h1>Hi, Short Farm!</h1>
        <p className="text-xs">You have a new order from BillyConsumer</p>
        <p className="text-2xl">Order Details:</p>
        <ul className="grid grid-cols-2 text-xl mb-1 border-t border-b py-2">
          Items
          <div className="text-sm text-start">
            <li>3 oz of Tomatoes</li>
            <li>5 oz of Beef</li>
            <li>8 oz of Chicken</li>
          </div>
        </ul>
        <ul className="grid grid-cols-2 text-xl border-b items-center py-2">
          Pickup Date
          <div>
            <li className="text-sm">Tues 12:00 PM</li>
          </div>
        </ul>
        <ul className="grid grid-cols-2 text-xl border-b items-center py-2">
          Order Total
          <div>
            <li className="text-sm">$20.00</li>
          </div>
        </ul>
        <button className="bg-slate-500 rounded-full py-2 shadow-lg text-white px-2 mt-2">
          Go to conversation
        </button>
        <button className="bg-slate-500 rounded-full shadow-lg text-white py-2 px-2 mt-2">
          Go to sell orders
        </button>
      </div>
    </div>
  );
};

export default Page;
