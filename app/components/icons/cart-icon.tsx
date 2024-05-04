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

interface CartProps {
  cart: CartItem[];
}

const CartIcon = ({ cart }: CartProps) => {
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
  if (cart.length === 0) {
    return null;
  }
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <div className="relative">
            <BsBasket className="w-7 h-7" />
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
                    src={item.listing.imageSrc}
                    alt={item.listing.title}
                    height={100}
                    width={100}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div>
                    <h4 className="font-semibold">
                      {item.quantity} {item.listing.quantityType}{" "}
                      {item.listing.title}
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
