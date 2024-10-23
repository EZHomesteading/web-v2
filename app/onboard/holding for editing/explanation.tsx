import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const CenteredStep = ({
  stepNumber,
  title,
  description,
}: {
  stepNumber: number;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center sm:justify-center h-full px-20 ">
      <div
        className={`w-full max-w-2xl flex flex-col items-start text-start ${outfit.className}`}
      >
        <div className="text-xl sm:text-2xl font-light">Step {stepNumber}</div>
        <div className="text-3xl sm:text-6xl ">{title}</div>
        <div className="text-xs sm:text-base mt-2 font-extralight">
          {description}
        </div>
      </div>
    </div>
  );
};

export default CenteredStep;
