import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Work_Sans } from "next/font/google";
import axios from "axios";
import { toast } from "sonner";

const work = Work_Sans({
  display: "block",
  subsets: ["latin"],
  weight: ["300"],
});

interface StockCounterProps {
  initialStock: number;
  listingId: string;
  onUpdate: (newStock: number) => void;
}

const StockCounter: React.FC<StockCounterProps> = ({
  initialStock,
  onUpdate,
  listingId,
}) => {
  const [count, setCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setCount(value);
    }
  };

  const handleAddStock = () => {
    const newStock = initialStock + count;
    axios
      .post("/api/listing/updateListing", {
        id: listingId,
        stock: initialStock + count,
      })
      .then(() => {
        toast.success("Your Listing was Updated!");
      })
      .catch((error) => {
        toast.error(error);
      });

    onUpdate(newStock);
    setCount(0);
  };

  const handleRemoveStock = () => {
    const newStock = Math.max(0, initialStock - count);
    axios
      .post("/api/listing/updateListing", {
        id: listingId,
        stock: initialStock - count,
      })
      .then(() => {
        toast.success("Your Listing was Updated!");
      })
      .catch((error) => {
        toast.error(error);
      });

    onUpdate(newStock);
    setCount(0);
  };

  return (
    <div className="flex flex-row items-center space-x-2">
      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        className="w-16 text-center border rounded p-1 text-sm"
        min="0"
      />
      <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
        <Button
          onClick={handleAddStock}
          className={`text-xs py-1 px-2 h-auto ${work.className}`}
        >
          Add Stock
        </Button>
        <Button
          onClick={handleRemoveStock}
          className={`text-xs py-1 px-2 h-auto ${work.className}`}
        >
          Remove Stock
        </Button>
      </div>
    </div>
  );
};

export default StockCounter;
