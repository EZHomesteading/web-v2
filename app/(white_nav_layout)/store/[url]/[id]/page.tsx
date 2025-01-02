import { UserInfo } from "next-auth";
import { auth } from "@/auth";
import Avatar from "@/components/Avatar";
import { outfitFont } from "@/components/fonts";
import {
  MarketCard,
  StarRating,
} from "@/app/(nav_market_layout)/market/_components/market-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import Bio from "../bio";
import { GetStoreByLocation, getUserStore } from "@/actions/getUser";
interface LocationStorePageProps {
  params: {
    id: string;
  };
}
const StorePage = async ({ params }: LocationStorePageProps) => {
  const id = params.id;
  const listings = await GetStoreByLocation({ id: id });
  console.log(listings);
  const session = await auth();
  return (
    <></>
    // <>
    //   <div className="w-full px-4 mx-auto max-w-[1920px] !z-0 mb-20 ">
    //     <div className="flex justify-between items-start">
    //       <div className="flex flex-row items-start ">
    //         <Avatar image={store?.user?.image} h="16" />
    //         <div
    //           className={`${outfitFont.className} weight-100 flex flex-col ml-2`}
    //         >
    //           <div className="flex flex-col items-start gap-x-2">
    //             <div className="font-bold text-2xl lg:text-4xl">
    //               {store?.user?.name}
    //             </div>
    //             <div className="text-sm text-gray-600 flex items-center gap-x-1">
    //               {/* Average Organic Rating: */}
    //               <StarRating value={4} />
    //             </div>
    //           </div>

    //           <div>{store?.user?.fullName?.first}</div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex justify-start">
    //       {store.user.locations > 1 && (
    //         <Popover>
    //           <PopoverTrigger asChild>
    //             <button
    //               className={`border border-grey px-3 py-2 rounded ${outfitFont.className}`}
    //             >
    //               Location Filter
    //             </button>
    //           </PopoverTrigger>
    //           <PopoverContent className={`ml-4`}>
    //             {store.user?.locations.map((location: any, index: number) => (
    //               <Link href={`/store/${url}/${location.id}`} key={index}>
    //                 {location.displayName || `Location ${index + 1}`}
    //               </Link>
    //             ))}
    //           </PopoverContent>
    //         </Popover>
    //       )}

    //       <Bio
    //         user={store?.user as unknown as UserInfo}
    //         bio={"test"}
    //         role={store?.user?.role}
    //         reviews={store?.reviews}
    //       />
    //     </div>
    //     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    //       {store.user?.listings.map((listing: any, index: number) => (
    //         <MarketCard listing={listing} imageCount={index} key={index} />
    //       ))}
    //     </div>
    //   </div>

    //   {/* <div className="pl-[10px]">
    //       <FollowButton followUserId={store?.user?.id} following={following} />
    //     </div> */}
    // </>
  );
};

export default StorePage;
