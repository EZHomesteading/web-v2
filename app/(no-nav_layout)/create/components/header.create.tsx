import { OutfitFont } from "@/components/fonts";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface p {
  street?: string | null;
  setStep: Dispatch<SetStateAction<number>>;
}

const CreateHeader = ({ street = "", setStep }: p) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setIsAtTop(position < 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`
      sticky top-0 w-full flex justify-center items-center bg-white z-100 ${
        OutfitFont.className
      }
      transition-[padding] duration-300 ease-in-out
      ${isAtTop ? "pt-2" : "pt-0"}
    `}
    >
      <div className="w-full max-w-[306.88px] sm:max-w-[402.88px] text-sm font-semibold flex flex-col items-center justify-center text-center border-b z-100">
        <button
          className="cursor-pointer mb-1 mx-auto h-8"
          onClick={() => setStep(1)}
        >
          {street}
        </button>
      </div>
    </div>
  );
};

export default CreateHeader;
