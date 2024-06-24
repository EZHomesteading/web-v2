"use client";

import Modal from "@/app/components/modals/chatmodals/Modal";
import { Button } from "@/app/components/ui/button";
import { addDays, format } from "date-fns";
import { AdjustedListings } from "./order-create";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  expiryArr: AdjustedListings[];
  createOrder: () => void;
}

const SoonExpiryModal: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  expiryArr,
  createOrder,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-center items-center   ">
          <div className="w-fit border-none shadow-none">
            <div className="grid gap-4">
              <div className="bg-white">
                {expiryArr.map((expiryObj: AdjustedListings) => {
                  const shelfLifeDisplay = expiryObj.expiry
                    ? `${format(expiryObj.expiry, "MMM dd, yyyy")}`
                    : "This product is non-perisable";
                  return (
                    <div className="px-1 py-[.35rem] rounded-lg border-gray-200 border-[1px]">
                      {expiryObj.soonValue === 1
                        ? `Your ${expiryObj.title} from ${expiryObj.sellerName} will expire in three days! This item will expire on ${shelfLifeDisplay}`
                        : null}
                      {expiryObj.soonValue === 2
                        ? `Your ${expiryObj.title} from ${expiryObj.sellerName} is nearing its expiry date! This item will expire on ${shelfLifeDisplay}`
                        : null}
                      {expiryObj.soonValue === 3
                        ? `Your ${expiryObj.title} from ${expiryObj.sellerName} is past its expiry date! This item expired on ${shelfLifeDisplay}`
                        : null}
                    </div>
                  );
                })}
                <Button
                  onClick={createOrder}
                  className="bg-green-300 text-black hover:text-white hover:bg-green-600 shadow-md hover:shadow-xl w-full"
                >
                  I'm okay with this, Procede to Checkout
                </Button>

                <Button
                  onClick={onClose}
                  className="bg-red-300 text-black hover:text-white hover:bg-red-600 shadow-md hover:shadow-xl w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SoonExpiryModal;
