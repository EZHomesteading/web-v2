import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";

interface Props {
  user?: UserInfo;
}
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const StepOne: React.FC<Props> = ({ user }) => {
  return (
    <div className="flex items-center sm:justify-center h-full px-20 ">
      <div
        className={`w-full max-w-2xl flex flex-col items-start text-start ${outfit.className}`}
      >
        <div className="text-4xl font-semibold">
          Welcome, {user?.firstName || user?.name}
        </div>
        <div className="mb-10 font-light">
          Some additional information is required before you can start listing
          items
        </div>
        <div className="text-xl sm:text-2xl font-light">Step 1</div>
        <div className="text-3xl sm:text-6xl ">Set Up Your Store</div>
        <div className="text-xs sm:text-base mt-2 font-extralight">
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

export default StepOne;
