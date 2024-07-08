import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const StepTwo = () => {
  return (
    <div className="grid grid-cols-4 h-full">
      <div className="grid-span-1"></div>
      <div
        className={`flex flex-col items-start justify-center grid-span-2 ${outfit.className}`}
      >
        <div className="text-2xl">Step 1</div>
        <div className="text-6xl">Set Up Your Store</div>
        <div className="text-md mt-2">
          First, we'll ask you for the location you'll be selling produce from
          most frequently. This will give you a default location to sell from,
          making listing your produce quick & easy. Next, you'll need to set
          open and close hours at that location, which is when buyers can pick
          up produce from you.
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
