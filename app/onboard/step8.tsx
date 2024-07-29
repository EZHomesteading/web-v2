import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const StepEight = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-full">
      <div className="hidden md:block md:col-span-1"></div>
      <div
        className={`flex flex-col items-start justify-center col-span-1 md:col-span-2 p-4 md:p-0 ${outfit.className}`}
      >
        <div className="md:hidden">
          <div className="text-2xl">Step 3</div>
          <div className="text-4xl mb-4">Set Up Payouts</div>
        </div>
        <div className="hidden md:block text-2xl">Step 3</div>
        <div className="hidden md:block text-6xl">Set Up Payouts</div>
        <div className="text-md mt-2">
          Lastly, EZHomesteading partners with Stripe for both payments and payouts. The information you provide here is required by government regulation to protect yourself and others against fraud. You can skip this step for now, but the funds from any completed orders will held in escrow under your account name until this is set up.
        </div>
      </div>
    </div>
  );
};

export default StepEight;