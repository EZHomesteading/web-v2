//render market product cards on server, with toggle cart buttons
import { UserInfo } from "next-auth";
import Categories from "./categories";
import EmptyState from "@/components/EmptyState";
import { UserRole } from "@prisma/client";
import { MarketCard, MarketGrid } from "./market-components";
interface DayHours {
  date: string;
  timeSlots: TimeSlot[];
  capacity: number;
}
interface TimeSlot {
  open: number;
  close: number;
}

export interface MarketListing {
  id: string;
  title: string;
  imageSrc: string[];
  price: number;
  rating: number[];
  quantityType?: string;
  stock: number;
  location: {
    id: string;
    displayName: string;
    address: string[];
    role: UserRole;
    hours: {
      pickup?: DayHours[];
      delivery?: DayHours[];
      [key: string]: DayHours[] | undefined;
    };
  } | null;
  minOrder?: number;
  user: {
    id: string;
    name: string;
  };
}

interface ShopProps {
  listings: MarketListing[];
  user?: UserInfo;
  basketItemIds: any[];
  params?: string;
}

const Shop = ({ params, listings, user, basketItemIds }: ShopProps) => {
  let imageCount = 0;
  return (
    <>
      <div className={`sticky top-20 w-full border-b pb-2 bg-white z-content`}>
        <Categories />
      </div>
      {!listings ? (
        <EmptyState showReset />
      ) : (
        <MarketGrid>
          {listings?.map((listing, index) => (
            <MarketCard
              user={user}
              key={index}
              listing={listing}
              imageCount={imageCount}
              basketItemIds={basketItemIds}
              params={params}
            />
          ))}
        </MarketGrid>
      )}
    </>
  );
};

export default Shop;
