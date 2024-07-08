import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const StepOne = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="grid-span-1 w-full items-center justify-center flex">
        <div
          className={`text-6xl flex flex-col items-center justify-center h-full w-[40%] ${outfit.className} font-normal`}
        >
          Effortlessly Sell Your Excess Produce with EZHomesteading
        </div>
      </div>
      <div className="grid-span-1 w-full items-start justify-start flex ml-[10%]">
        <div
          className={`flex items-center justify-center h-full ${outfit.className} font-normal`}
        >
          <div className="flex flex-col gap-y-5 w-[70%]">
            <div className="flex flex-col">
              <div className="flex text-3xl">
                1 <div className="ml-3">Configure Your Store</div>
              </div>
              <div className="font-extralight text-xl">
                Set up a selling location & hours where buyers can pick up your
                produce from
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-3xl">
                2 <div className="ml-3">Build Your Profile</div>
              </div>
              <div className="font-extralight text-xl">
                Add a profile picture, bio, & other details to help local buyers
                connect with you
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-3xl">
                3 <div className="ml-3">Set Up Payouts</div>
              </div>
              <div className="font-extralight text-xl">
                Connect with Stripe for a secure & simple payout system
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
