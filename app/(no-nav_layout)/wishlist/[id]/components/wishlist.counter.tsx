"use client";
import { useState } from "react";
import { PiMinusCircleThin, PiPlusCircleThin } from "react-icons/pi";

const WishlistCounter = ({ num }: { num: number }) => {
  const [q, setQ] = useState(num);
  return (
    <div className={`absolute bottom-2 left-0`}>
      <div className={`flex items-center justify-center gap-x-4`}>
        <PiMinusCircleThin className="text-3xl" />
        {q}
        <PiPlusCircleThin className="text-3xl" />
      </div>
    </div>
  );
};

export default WishlistCounter;
