"use client";

import { OutfitFont } from "@/components/fonts";
import Modal from "@/components/modals/chatmodals/Modal";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  expiryArr: any;
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
      <div
        className={`${OutfitFont.className} flex flex-col justify-between h-full`}
      >
        <div>
          {expiryArr.map((expiryObj: any) => {
            const shelfLifeDisplay = expiryObj.expiry
              ? `${format(expiryObj.expiry, "MMM dd, yyyy")}`
              : "This product is non-perisable";
            return (
              <div className={`px-1 py-[.35rem] overflow-y-auto`}>
                {expiryObj.soonValue === 1
                  ? `Your ${expiryObj.title} from ${expiryObj.sellerName} may expire within three days! This item is projected expire on ${shelfLifeDisplay}`
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
        </div>
        <div className="flex flex-col gap-y-2">
          <Button
            onClick={createOrder}
            className="bg-green-300 text-black hover:text-white hover:bg-green-600 shadow-md hover:shadow-xl w-full"
          >
            I'm okay with this, proceed to Checkout
          </Button>

          <Button
            onClick={onClose}
            className="bg-red-300 text-black hover:text-white hover:bg-red-600 shadow-md hover:shadow-xl w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SoonExpiryModal;
