import { useState, useEffect } from "react";
import { getFulfillmentText } from "./step5";

interface p {
  fulfillmentStyle?: string;
  street?: string;
  formDataStreet?: string;
}

const OnboardHeader = ({ fulfillmentStyle, street, formDataStreet }: p) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setIsAtTop(position < 10); // You can adjust this threshold
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`
        sticky top-0 w-full flex justify-center bg-white z-10 
        transition-[padding] duration-300 ease-in-out
        ${isAtTop ? "pt-[10%] sm:pt-[5%]" : "pt-2"}
      `}
    >
      <div className="w-full max-w-[306.88px] sm:max-w-[402.88px] text-sm font-semibold flex border-b py-1">
        <div className="pr-2 w-1/2 overflow-hidden">
          <div className="truncate">{formDataStreet || street || ""}</div>
        </div>
        <div className="border-l pl-2 w-1/2">
          {getFulfillmentText(fulfillmentStyle)}
        </div>
      </div>
    </div>
  );
};

export default OnboardHeader;
