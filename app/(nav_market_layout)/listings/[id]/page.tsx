//listing page server side layout, getting users and their carts to display toggle cart options.
import { getUnique } from "@/actions/getListings";
import ListingHead from "@/components/listings/ListingHead";
import { OutfitFont } from "@/components/fonts";
import Link from "next/link";
import {
  PiArrowLeftThin,
  PiBasketThin,
  PiCheckThin,
  PiInfoThin,
} from "react-icons/pi";
import { auth } from "@/auth";
import Avatar from "@/components/Avatar";
import SendMessageComponent from "./components/send-message-component";
import { Viewport } from "next";
import Page404 from "@/app/[...not_found]/page";

export const viewport: Viewport = {
  themeColor: "#fff",
};

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const marketCallback =
    searchParams &&
    `${new URLSearchParams(searchParams as Record<string, string>).toString()}`;

  const session = await auth();
  try {
    const listing = await getUnique({ id: params.id });
    const ratingMeanings: { [key: number]: string } = {
      1: "Not Genetically Modified",
      2: "No Inorganic Fertilizers",
      3: "No Inorganic Pesticides",
      4: "Not Modified After Harvest",
    };

    const inverseRatingMeanings: { [key: number]: string } = {
      1: "May be Genetically Modified",
      2: "May use Inorganic Fertilizers",
      3: "May use Inorganic Pesticides",
      4: "May be Modified After Harvest",
    };

    if (!listing) {
      return <Page404 />;
    }

    const applicableRatings = listing.rating.filter(
      (index: number) => index !== 0 && index in ratingMeanings
    );

    const possibleRatings = [1, 2, 3, 4];
    const inverseRatings = possibleRatings.filter(
      (index) => index !== 0 && !applicableRatings.includes(index)
    );

    let basketItemIds = [];
    if (session?.user?.id) {
      try {
        const response = await fetch(
          `${process.env.API_URL}/get-many?collection=BasketItem&key=userId&value=${session.user.id}&fields=listingId,id`
        );

        const data = await response.json();
        basketItemIds = data.items;
      } catch (error) {
        console.error("Error fetching basket items:", error);
      }
    }

    return (
      <>
        <div
          id="modal-root"
          className={`w-full max-w-5xl relative mx-auto ${OutfitFont.className}`}
        >
          <div className={`fixed top-0 w-full max-w-5xl z-10 bg-white`}>
            <div
              className={`h-16  flex justify-between items-center w-full  pr-2 lg:pr-0 pl-1 lg:pl-0`}
            >
              <div className={`flex items-center justify-start space-x-3 `}>
                <Link
                  href={`/market${marketCallback && `?${marketCallback}`}`}
                  prefetch={true}
                  className={`rounded-full border text-black p-3`}
                >
                  <PiArrowLeftThin />
                </Link>
                <div className={` text-3xl font-medium sm:block hidden`}>
                  {listing.title}
                </div>
              </div>
              <Link
                href={`/my-basket`}
                className={`flex  hover:cursor-pointer justify-start items-start space-x-1`}
              >
                <div>
                  <PiBasketThin className="text-2xl" />
                </div>
                <div className={`text-md underline font-normal`}>
                  My Baskets
                </div>
              </Link>
            </div>
          </div>
          <ListingHead listing={listing} />
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 px-2 lg:px-0 mt-2 sm:space-x-2`}
          >
            <div className={`col-span-1 lg:col-span-3 `}>
              <div className={` `}>
                <div
                  className={` text-xl sm:text-3xl block sm:hidden font-medium `}
                >
                  {listing.title}
                </div>
                <div className={`text-sm sm:text-2xl mt-[-5px]`}>
                  {listing.location?.address[1]}, {listing.location?.address[2]}
                </div>
                <div
                  className={`flex items-center justify-start space-x-1 text-sm mb-3`}
                >
                  <div>
                    {listing.stock} {listing.quantityType} remaining
                  </div>
                  <div className={`bg-black h-1 w-1 rounded-full`} />
                  <div>
                    ${listing.price} per {listing.quantityType}
                  </div>
                </div>
                <Link
                  className={`border-y py-3 flex items-start justify-start gap-x-2  `}
                  href={`/store/${listing.user.url}`}
                >
                  <Avatar
                    image={listing.location?.image || listing.user.image}
                    h="12"
                    h2="16"
                  />
                  <div className={`flex flex-col items-center `}>
                    <div className={`text-xl`}>
                      {listing.location?.displayName || listing.user.name}
                    </div>
                    <div>{listing.user?.fullName?.first}</div>
                  </div>
                </Link>
                <ul className="list-none list-inside my-3 space-y-4 border-b pb-3">
                  {applicableRatings.map((ratingIndex: number) => (
                    <li
                      key={ratingIndex}
                      className="text-lg  flex items-center gap-x-1"
                    >
                      <div className={`p-2`}>
                        <svg
                          viewBox="0 0 24 24"
                          fill={"black"}
                          stroke={"black"}
                          strokeWidth="2"
                          style={{ width: 20, height: 20 }}
                        >
                          <path d="M12 2L8.5 8.5L2 9.3L7 14.1L5.5 20.5L12 17.5L18.5 20.5L17 14.1L22 9.3L15.5 8.5L12 2Z" />
                        </svg>
                      </div>
                      {ratingMeanings[ratingIndex]}
                    </li>
                  ))}
                  {inverseRatings.map((ratingIndex) => (
                    <li
                      key={ratingIndex}
                      className="text-lg flex items-center gap-x-1"
                    >
                      <div className={`p-2`}>
                        <svg
                          viewBox="0 0 24 24"
                          fill={"none"}
                          stroke={"black"}
                          strokeWidth="2"
                          style={{ width: 20, height: 20 }}
                        >
                          <path d="M12 2L8.5 8.5L2 9.3L7 14.1L5.5 20.5L12 17.5L18.5 20.5L17 14.1L22 9.3L15.5 8.5L12 2Z" />
                        </svg>
                      </div>
                      {inverseRatingMeanings[ratingIndex]}
                    </li>
                  ))}
                </ul>
                <div className={`h-[50vh]`}>{listing.description}</div>
              </div>
            </div>
            <div className={`col-span-1 lg:col-span-2 relative`}>
              <SendMessageComponent
                listing={listing}
                user={session?.user}
                isInitiallyInBasket={basketItemIds.some(
                  (item: any) => item?.listingId === listing.id
                )}
              />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in ListingPage:", error);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Something went wrong!</h1>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
}
