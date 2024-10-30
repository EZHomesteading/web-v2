import { BsBank } from "react-icons/bs";
import { Button } from "@/components/ui/button";

const StepOne = () => {
  return (
    <div className="flex-1 flex items-center justify-center px-6 sm:px-20 mt-16 mb-20">
      <div className="w-full max-w-2xl">
        {/* Icon and Title Container */}
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gray-100 rounded-xl">
            <BsBank className="w-8 h-8 text-gray-700" />
          </div>
          <h1 className="text-3xl sm:text-6xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Set Up Payouts
          </h1>
        </div>

        <div className="w-[100%] h-1 bg-gradient-to-r from-gray-800 to-gray-400 rounded-full mb-6" />

        <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl">
          EZHomesteading partners with Stripe for both payments and payouts. The
          information you provide here is required by government regulation to
          protect yourself and others against fraud.
        </p>
        <Button
          className="mt-4"
          onClick={() =>
            window.open("https://support.stripe.com/topics/payouts", "_blank")
          }
        >
          More Info
        </Button>
      </div>
    </div>
  );
};

export default StepOne;
