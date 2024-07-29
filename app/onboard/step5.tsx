import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const StepFive = () => {
  return (
    <div className="grid grid-cols-4 h-full">
      <div className="grid-span-1"></div>
      <div
        className={`flex flex-col items-start justify-center grid-span-2 ${outfit.className}`}
      >
        <div className="text-2xl">Step 2</div>
        <div className="text-6xl">Set Up Your Profile</div>
        <div className="text-md mt-2">
          Now, we'd like to personalize your profile a bit. In this step, you can add a profile photo and a store bio. While neither of these are required, we recommend sellers add this info to help buyers connect with you!
        </div>
      </div>
    </div>
  );
};

export default StepFive;