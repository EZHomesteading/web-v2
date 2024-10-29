import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { XMarkIcon as XMarkIconMini } from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import { PiBasketThin } from "react-icons/pi";
import { CartItem } from "@/actions/getCart";

import { outfitFont, zillaFont } from "../../outfit.font";

interface c {
  cart: CartItem[];
}

const getQuantityWording = (
  quantityType: string,
  quantity: number,
  title: string
) => {
  const endsWithIes = title.toLowerCase().endsWith("ies");
  const endsWithS = title.toLowerCase().endsWith("s");
  const isBerryOrCherry =
    title.toLowerCase().includes("berr") ||
    title.toLowerCase().includes("cherr");

  let pluralizedTitle = title;
  if (quantity === 1 && quantityType === "none") {
    if (endsWithIes) {
      pluralizedTitle = title.slice(0, -3) + "y";
    } else if (endsWithS && !isBerryOrCherry) {
      pluralizedTitle = title.slice(0, -1);
    }
  }

  if (quantityType === "none" || quantityType === "") {
    return `${quantity} ${pluralizedTitle}`;
  }

  let quantityTypeText = quantityType;
  if (quantity > 1) {
    switch (quantityType) {
      case "oz":
        quantityTypeText = "ounces";
        break;
      case "lb":
        quantityTypeText = "pounds";
        break;
      case "kg":
        quantityTypeText = "kilograms";
        break;
      case "dozen":
        quantityTypeText = "dozen";
        break;
      default:
        quantityTypeText += "s";
    }
  }

  switch (quantityType) {
    case "oz":
    case "lb":
    case "kg":
    case "gram":
    case "bushel":
    case "carton":
      return `${quantity} ${quantityTypeText} of ${pluralizedTitle}`;
    case "dozen":
      return `${quantity} ${quantityTypeText} ${pluralizedTitle}`;
    default:
      return `${quantity} ${pluralizedTitle}`;
  }
};

const CartIcon = ({ cart }: c) => {
  const pathname = usePathname();
  const white = pathname === "/" || pathname?.startsWith("/chat");
  if (!cart || cart.length === 0) {
    return null;
  }
  const router = useRouter();
  const groupedListings: Record<string, CartItem[]> = cart.reduce(
    (acc: Record<string, CartItem[]>, item: CartItem) => {
      const userId = item.listing.user.id;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>
  );

  // if (cart.length === 0) {
  //   return null;
  // }
  return (
    <div className={`${outfitFont.className}`}>
      <Sheet>
        <SheetTrigger className="flex pb-4 sm:pb-2 flex-col items-center">
          <div className="relative">
            <PiBasketThin className={`h-8 w-8`} />
            <div className="absolute top-[0px] right-[-5px] text-green bg-red-400 rounded-full w-4 text-white p-[1px] text-xs">
              {cart.length}
            </div>
          </div>
          <div className={` text-xs font-medium `}>Cart</div>
        </SheetTrigger>

        <SheetContent
          className={`${outfitFont.className} bg px-4 py-4 min-h-screen overflow-y-auto`}
        >
          <SheetHeader className="text-3xl mb-3 font-bold">
            <div className=" flex flex-row justify-start text-nowrap">
              <Link href="/cart">
                {" "}
                <SheetTrigger
                  className="
         
         cursor-pointer
         text-center bg-emerald-950 text-white hover:bg-green-700  rounded-full shadow-sm px-4 py-2 text-sm "
                >
                  Go to Cart
                </SheetTrigger>
              </Link>
              <Link href="/market">
                <SheetTrigger
                  className="
           
           cursor-pointer
           text-center bg-emerald-950 hover:bg-green-700 text-white  ml-2 rounded-full px-4 py-2 text-sm"
                >
                  Continue Shopping
                </SheetTrigger>
              </Link>
            </div>
            Cart
          </SheetHeader>

          {Object.entries(groupedListings).map(([userId, userListings]) => (
            <div key={userId}>
              <h3 className="font-semibold mb-2">
                {(userListings as CartItem[])[0].listing.user.name}
              </h3>
              {(userListings as CartItem[]).map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-4">
                  <Image
                    src={item.listing.imageSrc[0]}
                    alt={item.listing.title}
                    height={80}
                    width={80}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex flex-row justify-between w-full">
                    <h4 className={`${zillaFont.className} text-sm font-light`}>
                      {getQuantityWording(
                        item.listing.quantityType
                          ? item.listing.quantityType
                          : "",
                        item.quantity,
                        item.listing.title
                      )}
                    </h4>
                    <div>
                      <button
                        type="button"
                        className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        onClick={async () => {
                          const cartId = item.id;
                          await axios.delete(`/api/cart/${cartId}`);
                          router.refresh();
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        <XMarkIconMini className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartIcon;
