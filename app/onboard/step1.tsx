import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const StepOne = () => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 h-full p-4 lg:p-0">
      <div className="flex items-center justify-center mb-8 lg:mb-0">
        <div
          className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-center lg:text-left ${outfit.className} font-normal lg:w-[80%] xl:w-[70%] 2xl:w-[60%]`}
        >
          Effortlessly Sell Your Excess Produce with EZHomesteading
        </div>
      </div>
      <div className="flex items-center justify-center lg:ml-[10%]">
        <div
          className={`flex items-center justify-center w-full ${outfit.className} font-normal`}
        >
          <div className="flex flex-col gap-y-5 w-full lg:w-[90%] xl:w-[80%] 2xl:w-[70%]">
            <StepItem
              number="1"
              title="Configure Your Store"
              description="Set up a selling location & hours where buyers can pick up your produce from"
            />
            <div className="my-4 border"></div>
            <StepItem
              number="2"
              title="Build Your Profile"
              description="Add a profile picture, bio, & other details to help local buyers connect with you"
            />
            <div className="my-4 border"></div>
            <StepItem
              number="3"
              title="Set Up Payouts"
              description="Connect with Stripe for a secure & simple payout system"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StepItem = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col">
    <div className="flex text-xl sm:text-2xl lg:text-3xl mb-2">
      {number} <div className="ml-3">{title}</div>
    </div>
    <div className="font-extralight text-base sm:text-lg lg:text-xl">
      {description}
    </div>
  </div>
);

export default StepOne;
