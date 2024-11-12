"use client";

import { FinalListing } from "@/actions/getListings";
import Modal from "@/components/modals/chatmodals/Modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ValidTime } from "./CustomTimeModal2";
import { Order } from "@prisma/client";

interface CustomTimeProps {
  isOpen?: boolean;
  onClose: () => void;
  listing: FinalListing;
  quantity: number;
  expiry: Date;
  childTime: ValidTime | undefined;
}
interface Body {
  userId: string;
  listingIds: string[];
  pickupDate: Date | undefined;
  quantity: string;
  totalPrice: number;
  status: number;
}
const SoonExpiryModal: React.FC<CustomTimeProps> = ({
  isOpen,
  onClose,
  listing,
  quantity,
  expiry,
  childTime,
}) => {
  const router = useRouter();
  const post = async () => {
    let body: Body[] = [];
    await body.push({
      userId: listing.user.id,
      listingIds: [listing.id],
      pickupDate: childTime?.pickupTime,
      quantity: `[{\"id\":\"${listing.id}\",\"quantity\":${quantity}}]`,
      totalPrice: quantity * listing.price,
      status: 0,
    });
    await axios.delete(`/api/useractions/checkout/cart`);
    try {
      await axios.post(`/api/useractions/checkout/cart/${listing.id}`, {
        quantity: quantity,
        pickup: null,
      });
    } catch (err: any) {
      toast.error(err.response.data.error);
      return;
    }
    const response = await axios.post(
      "/api/useractions/checkout/create-order",
      body
    );
    const datas = response.data;
    await datas.forEach((data: Order) => {
      let store = sessionStorage.getItem("ORDER");
      if (store === null) {
        store = "";
      }
      let filteredStore = store.replace(/\[|\]/g, "");
      sessionStorage.setItem(
        "ORDER",
        `[${JSON.stringify(data.id)}` + "," + `${filteredStore}]`
      );
    });
    router.push("/checkout");
  };

  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const percentExpiry = new Date(
    now.getTime() + listing.shelfLife * 0.3 * 24 * 60 * 60 * 1000
  );
  const shelfLife = (listing: FinalListing) => {
    const adjustedListing = {
      ...listing,
      createdAt: new Date(listing.createdAt),
      endDate:
        listing.shelfLife !== -1
          ? addDays(new Date(listing.createdAt), listing.shelfLife)
          : null,
    };

    const shelfLifeDisplay = adjustedListing.endDate
      ? `${format(adjustedListing.endDate, "MMM dd, yyyy")}`
      : "This product is non-perisable";
    return shelfLifeDisplay;
  };
  const text = () => {
    {
      if (expiry < now) {
        return `This listing of ${
          listing.title
        } is past its expiry date! This item expired on ${shelfLife(listing)}`;
      } else if (expiry < threeDaysLater) {
        return `This listing of ${
          listing.title
        } will expire in less than three days! This item will expire on ${shelfLife(
          listing
        )}`;
      } else if (expiry < percentExpiry) {
        return `This listing of ${
          listing.title
        } is nearing its expiry date! This item will expire on ${shelfLife(
          listing
        )}`;
      } else {
        return null;
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-center items-center   ">
          <div className="w-fit border-none shadow-none">
            <div className="grid gap-4">
              <div className="bg-white">
                <div className="px-1 py-[.35rem] rounded-lg border-gray-200 border-[1px]">
                  {text()}
                </div>

                <Button
                  onClick={post}
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
