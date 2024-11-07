"use client";
import { useState } from "react";
import { PiMinusCircleThin, PiPlusCircleThin } from "react-icons/pi";

const BasketCounter = ({ num }: { num: number }) => {
  const [q, setQ] = useState(num);
  return (
    <div className={`absolute bottom-2 left-0 select-none`}>
      <div className={`flex items-center justify-center gap-x-4`}>
        <PiMinusCircleThin
          className="text-3xl hover:cursor-pointer"
          onClick={() => {
            setQ(q - 1);
          }}
        />
        {q}
        <PiPlusCircleThin
          className="text-3xl hover:cursor-pointer"
          onClick={() => {
            setQ(q + 1);
          }}
        />
      </div>
    </div>
  );
};

export default BasketCounter;
