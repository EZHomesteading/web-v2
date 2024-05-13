import { BsBasket } from "react-icons/bs";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  quantity: number;
  listing: {
    imageSrc: string;
    title: string;
    quantity: number;
    quantityType: string;
    user: {
      id: string;
      name: string;
    };
  };
}

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
  if (!cart || cart.length === 0) {
    return null;
  }
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
    <>
      <Sheet>
        <SheetTrigger>
          <div className="relative">
            <BsBasket className="w-8 h-8" />
            <div className="absolute top-[0px] right-0 text-green bg-red-600 rounded-full w-5 p-[1px] text-xs">
              {cart.length}
            </div>
          </div>
        </SheetTrigger>

        <SheetContent className="bg px-4 py-4 min-h-screen overflow-y-auto">
          <SheetHeader className="text-3xl mb-3">Cart</SheetHeader>
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
                    height={100}
                    width={100}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div>
                    <h4 className="font-semibold">
                      {getQuantityWording(
                        item.listing.quantityType,
                        item.quantity,
                        item.listing.title
                      )}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <Link href="/cart">
            <SheetTrigger className="w-full shadow-xl mb-2 text-md py-1 rounded-xl">
              Go to Cart
            </SheetTrigger>
          </Link>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartIcon;
