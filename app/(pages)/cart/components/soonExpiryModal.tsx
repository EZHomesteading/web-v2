"use client";

import Modal from "@/app/components/modals/chatmodals/Modal";
import { Button } from "@/app/components/ui/button";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  soonExpiry: number;
  createOrder: () => void;
}

const SoonExpiryModal: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  soonExpiry,
  createOrder,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-center items-center   ">
          <div className="w-fit border-none shadow-none">
            <div className="grid gap-4">
              <div className="bg-white">
                <div className="px-1 py-[.35rem] rounded-lg border-gray-200 border-[1px]">
                  {soonExpiry === 1
                    ? `One or more of the products in you cart expires in less than three days!`
                    : null}
                  {soonExpiry === 2
                    ? `One or more of the products in your cart is nearing its expiry date!`
                    : null}
                  {soonExpiry === 3
                    ? `One or more of the products in your cart is past its expiry date!`
                    : null}
                </div>
                <Button
                  onClick={onClose}
                  className="bg-red-300 text-black hover:text-white hover:bg-red-600 shadow-md hover:shadow-xl w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createOrder}
                  className="bg-green-300 text-black hover:text-white hover:bg-green-600 shadow-md hover:shadow-xl w-full"
                >
                  I'm okay with this, Procede to Checkout
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
