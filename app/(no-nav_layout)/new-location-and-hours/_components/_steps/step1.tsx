import { OutfitFont } from "@/components/fonts";

const StepOne = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full px-20">
      <div
        className={`w-full max-w-2xl flex flex-col items-start text-start ${OutfitFont.className}`}
      >
        <div className="text-3xl sm:text-6xl ">Set Up Your Store</div>
        <div className="text-xs sm:text-base mt-2 font-extralight">
          To list produce publicly you'll need a location to sell from. Then,
          you'll need to set operating hours, or when buyers can pick up produce
          from you, or times you are likely able to deliver produce to buyers
          for a fee.
        </div>
      </div>
    </div>
  );
};

export default StepOne;
