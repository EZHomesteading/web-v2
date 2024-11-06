import { outfitFont, zillaFont } from "@/components/fonts";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Fees } from "@prisma/client";
import { X } from "lucide-react";
interface p {
  total: number;
  price: number;
  fees?: Fees;
  quantityType?: string;
  quantity: number;
}
const PriceBreakdown = ({ total, price, fees, quantityType, quantity }: p) => {
  return (
    <>
      <Popover>
        <PopoverTrigger
          className={`${zillaFont.className} underline text-emerald-600/70`}
        >
          ${total} total
        </PopoverTrigger>
        <PopoverContent
          className={`bg-white rounded-md shadow-xl w-full zmax h-64 min-w-[300px]`}
        >
          <div
            className={`text-center font-semibold border-b pb-3 ${outfitFont.className}`}
          >
            Price Breakdown
          </div>
          <div
            className={`${zillaFont.className} text-lg w-full flex flex-col gap-y-5 items-start`}
          >
            <div className="flex justify-between w-full pt-3">
              <div>
                ${price} x {quantity} {quantityType}
              </div>
              <div>${total}</div>
            </div>

            {[
              { label: "Delivery Fee", value: fees?.delivery || 0 },
              { label: "Seller Fee", value: fees?.other || 0 },
              { label: "EZH Fee", value: fees?.site || 0 },
            ].map((item, index) => (
              <div key={index} className="flex justify-between w-full">
                <div>{item.label}</div>
                <div>${item.value}</div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PriceBreakdown;
