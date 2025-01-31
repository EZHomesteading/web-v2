import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { UserInfo } from "next-auth";
import { OutfitFont, WorkFont } from "@/components/fonts";
import { MarketListing } from "./market-component";
import Link from "next/link";
import AvailabilityScore from "./availabilityScore";

interface ListingCardProps {
  listing: MarketListing;
  user?: UserInfo;
  imageCount: number;
}

interface StoreLocationCardProps {
  listing: MarketListing;
  user?: UserInfo;
  imageCount: number;
  location?: any;
}

const StarRating = ({
  value,
  size = 20,
  color = "#000",
}: {
  value: number;
  size?: number;
  color?: string;
}) => {
  const totalStars = 4;
  const roundedValue = Math.round(value * 2) / 2;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const filled = index < roundedValue;
        const halfFilled = !filled && index < Math.ceil(roundedValue);

        return (
          <span
            key={index}
            className="inline-block"
            style={{ width: size, height: size }}
          >
            {halfFilled ? (
              <svg
                viewBox="0 0 24 24"
                fill={color}
                style={{ width: size, height: size }}
              >
                <path
                  d="M12 2L8.5 8.5L2 9.3L7 14.1L5.5 20.5L12 17.5L18.5 20.5L17 14.1L22 9.3L15.5 8.5L12 2Z"
                  clipPath="inset(0 50% 0 0)"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill={filled ? color : "none"}
                stroke={color}
                strokeWidth="2"
                style={{ width: size, height: size }}
              >
                <path d="M12 2L8.5 8.5L2 9.3L7 14.1L5.5 20.5L12 17.5L18.5 20.5L17 14.1L22 9.3L15.5 8.5L12 2Z" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};

const MarketGrid = ({ children }: { children: any }) => {
  return (
    <div className="w-full px-4 mx-auto max-w-[1920px] !z-0 mb-20 ">
      <div
        className="
        pt-[6.5rem]
        grid gap-6
        grid-cols-1
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5"
      >
        {children}
      </div>
    </div>
  );
};
interface TimeSlot {
  open: number; // Hour in 24-hour format
  close: number; // Hour in 24-hour format
}

interface DayHours {
  date: string;
  timeSlots: TimeSlot[];
  capacity: number;
}

interface LocationHours {
  [key: string]: DayHours[] | undefined;
  pickup?: DayHours[];
  delivery?: DayHours[];
}

interface ScoreResult {
  pickup: {
    workingmanScore: number;
    retireeScore: number;
    combinedScore: number;
  };
  delivery: {
    workingmanScore: number;
    retireeScore: number;
    combinedScore: number;
  };
}

const MarketCard = ({ listing, imageCount }: ListingCardProps) => {
  const locHours = listing?.location?.hours;
  console.log(locHours);
  function calculateAvailabilityScores(
    hours: LocationHours | null | undefined
  ): ScoreResult {
    if (!hours) {
      return {
        pickup: { workingmanScore: 1, retireeScore: 1, combinedScore: 1 },
        delivery: { workingmanScore: 1, retireeScore: 1, combinedScore: 1 },
      };
    }

    return {
      pickup: calculateServiceScores(hours.pickup || []),
      delivery: calculateServiceScores(hours.delivery || []),
    };
  }

  function calculateServiceScores(hours: DayHours[]) {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    // Filter hours to only include next 7 days
    const relevantHours = hours.filter((hour) => {
      const hourDate = new Date(hour.date).toISOString().split("T")[0];
      return next7Days.includes(hourDate);
    });

    let workingmanScore = 0;
    let retireeScore = 0;

    // Calculate coverage percentage for each time period
    next7Days.forEach((date) => {
      const dayHours = relevantHours.find(
        (h) => new Date(h.date).toISOString().split("T")[0] === date
      );

      if (!dayHours) return;

      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;

      // Skip if no time slots
      if (!dayHours.timeSlots || dayHours.timeSlots.length === 0) return;

      // Working person coverage (4 PM - 8 PM)
      const workingCoverage = calculateTimeSlotCoverage(
        dayHours.timeSlots,
        960, // 4 PM
        1200 // 8 PM
      );

      // Retiree coverage (10 AM - 8 PM)
      const retireeCoverage = calculateTimeSlotCoverage(
        dayHours.timeSlots,
        600, // 10 AM
        1200 // 8 PM
      );

      // Apply weekend modifiers
      const weekendModifier = isWeekend ? (isSunday ? 0.3 : 0.1) : 1;

      workingmanScore += workingCoverage * weekendModifier;
      retireeScore += retireeCoverage * weekendModifier;
    });

    // Convert to 1-3 scale
    const normalizeScore = (score: number): number => {
      const maxPossibleScore = 7; // perfect coverage for all 7 days
      const normalized = (score / maxPossibleScore) * 3;
      return Math.max(1, Math.min(3, Math.ceil(normalized))); // Round up instead of rounding down
    };

    const finalWorkingmanScore = normalizeScore(workingmanScore);
    const finalRetireeScore = normalizeScore(retireeScore);

    // Calculate combined score (rounded up)
    const combinedScore = Math.ceil(
      (finalWorkingmanScore + finalRetireeScore) / 2
    );

    return {
      workingmanScore: finalWorkingmanScore,
      retireeScore: finalRetireeScore,
      combinedScore,
    };
  }

  function calculateTimeSlotCoverage(
    timeSlots: TimeSlot[],
    targetStart: number,
    targetEnd: number
  ): number {
    let totalCoverage = 0;
    const targetHours = targetEnd - targetStart;

    timeSlots.forEach((slot) => {
      // Calculate overlap
      const overlapStart = Math.max(slot.open, targetStart);
      const overlapEnd = Math.min(slot.close, targetEnd);
      if (overlapEnd > overlapStart) {
        totalCoverage += (overlapEnd - overlapStart) / targetHours;
      }
    });

    return Math.min(1, totalCoverage); // Cap at 1 (100% coverage)
  }
  const scores = calculateAvailabilityScores(locHours);
  console.log(scores);
  return (
    <Link
      href={`/listings/${listing.id}`}
      prefetch={true}
      className="block w-full cursor-pointer group mx-auto !z-0"
    >
      <div className="flex flex-col relative w-full z-0">
        <div className="relative overflow-hidden rounded-xl w-full z-0 aspect-square">
          <Carousel className="h-full w-full relative rounded-lg z-0">
            <CarouselContent className="h-full z-0">
              {listing.imageSrc.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center relative aspect-square h-full"
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1} of ${listing.title}`}
                    loading={imageCount++ < 9 ? "eager" : "lazy"}
                    fill
                    className="object-cover rounded-md hover:scale-105 transition-transform duration-200 !z-0"
                    sizes="(max-width: 540px) 100vw, (max-width: 768px) 50vw, (max-width: 1000px) 33.33vw, (max-width: 1280px) 25vw, 20vw"
                    placeholder="blur"
                    blurDataURL="/images/website-images/grey.jpg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {listing.imageSrc.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {listing.imageSrc.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white opacity-90 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>
        <div className="mt-2 w-full">
          <h3 className={`${OutfitFont.className} text-lg font-semibold`}>
            {listing.title}
          </h3>

          <p
            className={`${WorkFont.className} text-xs font-light text-neutral-500`}
          >
            {listing?.location?.address[1]}, {listing?.location?.address[2]}
          </p>

          <div className="flex items-center justify-between mt-2 w-full">
            <div
              className={`${WorkFont.className} text-sm flex items-center gap-1`}
            >
              <span className="font-semibold">${listing.price}</span>
              <span className="font-light">per {listing.quantityType}</span>
            </div>

            <StarRating
              value={listing.rating.length - 1}
              size={20}
              color="#000"
            />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <AvailabilityScore scores={scores} type="pickup" />
            <AvailabilityScore scores={scores} type="delivery" />
          </div>
        </div>
      </div>
    </Link>
  );
};
const StoreLocationCard = ({
  location,
  listing,
  imageCount,
}: StoreLocationCardProps) => {
  return (
    <Link
      href={`/listings/${listing.id}`}
      prefetch={true}
      className="block w-full cursor-pointer group mx-auto !z-0"
    >
      <div className="flex flex-col relative w-full z-0">
        <div className="relative overflow-hidden rounded-xl w-full z-0 aspect-square">
          <Carousel className="h-full w-full relative rounded-lg z-0">
            <CarouselContent className="h-full z-0">
              {listing.imageSrc.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center relative aspect-square h-full"
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1} of ${listing.title}`}
                    loading={imageCount++ < 9 ? "eager" : "lazy"}
                    fill
                    className="object-cover rounded-md hover:scale-105 transition-transform duration-200 !z-0"
                    sizes="(max-width: 540px) 100vw, (max-width: 768px) 50vw, (max-width: 1000px) 33.33vw, (max-width: 1280px) 25vw, 20vw"
                    placeholder="blur"
                    blurDataURL="/images/website-images/grey.jpg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {listing.imageSrc.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {listing.imageSrc.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white opacity-90 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>

        <div className="mt-2 w-full">
          <h3 className={`${OutfitFont.className} text-lg font-semibold`}>
            {listing.title}
          </h3>
          <p
            className={`${WorkFont.className} text-xs font-light text-neutral-500`}
          >
            {location?.address[1]}, {location?.address[2]}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1 w-full">
          <div className={`${WorkFont.className} text-xs`}>
            <span className="font-semibold">${listing.price}</span>
            <span className="font-light pl-1">per {listing.quantityType}</span>
          </div>

          <StarRating
            value={listing.rating.length - 1}
            size={20}
            color="#000"
          />
        </div>
      </div>
    </Link>
  );
};
export { StoreLocationCard, MarketGrid, MarketCard, StarRating };
