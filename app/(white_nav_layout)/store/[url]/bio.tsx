"use client";
import { ReviewWithReviewer } from "@/actions/getUser";
import { StarRating } from "@/app/(nav_market_layout)/market/(components)/market-components";
import Avatar from "@/components/Avatar";
import { OutfitFont } from "@/components/fonts";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StarIcon } from "@heroicons/react/20/solid";
import { Reviews, UserRole } from "@prisma/client";
import { format } from "date-fns";

interface Props {
  reviews?: ReviewWithReviewer[];
  user: any;
  bio: string;
  role?: UserRole;
}

interface p {
  reviews?: ReviewWithReviewer[];
  location?: any;
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getReviewCounts(reviews: Reviews[]) {
  const counts = [1, 2, 3, 4, 5].reduce((acc, rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    acc.push({ rating, count });
    return acc;
  }, [] as { rating: number; count: number }[]);

  return counts;
}

function getAverageRating(reviews: Reviews[]) {
  if (reviews.length === 0) return 0;

  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRatings / reviews.length;
  return Math.round(averageRating * 2) / 2;
}

const Bio = ({ user, reviews, role, bio }: Props) => {
  const counts = getReviewCounts(reviews || []);
  const total = reviews ? reviews.length : 0;
  const averageRating = getAverageRating(reviews || []);
  return (
    <Sheet>
      <SheetTrigger>
        <div
          className={`${OutfitFont.className} weight-100 flex flex-col ml-2`}
        >
          <div className="flex flex-col items-start gap-x-2">
            <div className="font-bold text-2xl lg:text-4xl">{user?.name}</div>

            <div className="text-sm text-gray-600 flex items-center gap-x-1">
              {/* Average Organic Rating: */}
              <StarRating value={4} />
            </div>
          </div>
          <div>{user?.fullName?.first}</div>{" "}
        </div>
      </SheetTrigger>
      <SheetContent
        className={`${OutfitFont.className} overflow-y-auto pt-10 zmax w-full max-w-md`}
        side={`left`}
      >
        <div className="flex flex-col px-2 gap-y-2">
          <div className="flex flex-row items-center">
            <Avatar image={user?.image} />
            <div
              className={`${OutfitFont.className} weight-100 flex flex-col ml-2`}
            >
              <div className="flex flex-col items-start gap-x-2">
                <div className="font-bold text-xl lg:text-2xl">
                  {user?.name}
                </div>
                <div>
                  EZH{" "}
                  {role === UserRole.COOP
                    ? "Co-op"
                    : role === UserRole.PRODUCER
                    ? "Producer"
                    : "Member"}{" "}
                  Since {format(user?.createdAt!, "MMM yyyy")}
                </div>
              </div>
            </div>
          </div>
          <h1 className={`text-xl`}>
            {user?.fullName?.first && `${user?.fullName?.first}&apos;s`} Bio
          </h1>
          <p className={`h-[50vh] border border-grey p-3 px-4 rounded-xl`}>
            {bio}
          </p>
          {total === 0 ? (
            <div
              className={`${OutfitFont.className} flex justify-center text-2xl mt-5`}
            >
              No reviews found
            </div>
          ) : (
            <>
              <div className="lg:col-span-4 px-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Reviews from Buyers
                </h2>

                <div className="mt-3 flex items-center">
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={classNames(
                            averageRating >= index + 1
                              ? "text-yellow-400"
                              : averageRating >= index + 0.5
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">
                      {averageRating.toFixed(1)} out of 5 stars
                    </p>
                  </div>
                  <p className="ml-2 text-sm text-gray-900">
                    {total !== 1 ? (
                      <>Based on {total} reviews</>
                    ) : (
                      <>Based on {total} review</>
                    )}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="sr-only">Review data</h3>

                  <dl className="space-y-3">
                    {counts.map((count: { rating: number; count: number }) => (
                      <div
                        key={count.rating}
                        className="flex items-center text-sm"
                      >
                        <dt className="flex flex-1 items-center">
                          <p className="w-3 font-medium text-gray-900">
                            {count.rating}
                            <span className="sr-only"> star reviews</span>
                          </p>
                          <div
                            aria-hidden="true"
                            className="ml-1 flex flex-1 items-center"
                          >
                            <StarIcon
                              className={classNames(
                                count.count > 0
                                  ? "text-yellow-400"
                                  : "text-gray-300",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />

                            <div className="relative ml-3 flex-1">
                              <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                              {count.count > 0 ? (
                                <div
                                  className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                  style={{
                                    width: `calc(${count.count} / ${total} * 100%)`,
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </dt>
                        <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                          {count ? (
                            <>{Math.round((count.count / total) * 100)}%</>
                          ) : (
                            <>0%</>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                <h3 className="sr-only">Recent reviews</h3>

                <div className="flow-root">
                  <div className="-my-12 divide-y divide-gray-200">
                    {reviews
                      ? reviews.map((review: ReviewWithReviewer) => {
                          return (
                            <div key={review.id} className="py-12">
                              <div className="flex items-center">
                                {review.reviewer
                                  ? review?.reviewer.name && (
                                      <Avatar image={review.reviewer.image} />
                                    )
                                  : null}
                                <div className="ml-4">
                                  {review.reviewer && (
                                    <h4 className="text-sm font-bold text-gray-900">
                                      {review?.reviewer.name}
                                    </h4>
                                  )}
                                  <div className="mt-1 flex items-center">
                                    {[...Array(5)].map((_, rating) => (
                                      <StarIcon
                                        key={rating}
                                        className={classNames(
                                          review.rating > rating
                                            ? "text-yellow-400"
                                            : "text-gray-300",
                                          "h-5 w-5 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                      />
                                    ))}
                                  </div>
                                  <p className="sr-only">
                                    {review?.rating} out of 5 stars
                                  </p>
                                </div>
                              </div>

                              <div
                                className="mt-4 space-y-6 text-base italic text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: review?.review,
                                }}
                              />
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
const StoreLocationBio = ({ reviews, location }: p) => {
  const counts = getReviewCounts(reviews || []);
  const total = reviews ? reviews.length : 0;
  const averageRating = getAverageRating(reviews || []);
  return (
    <Sheet>
      <SheetTrigger>
        <div
          className={`${OutfitFont.className} weight-100 flex flex-col ml-2`}
        >
          <div className="flex flex-col items-start gap-x-2">
            <div className="font-bold text-2xl lg:text-4xl">
              {location?.displayName}
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-x-1">
              {/* Average Organic Rating: */}
              <StarRating value={4} />
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        className={`${OutfitFont.className} overflow-y-auto pt-10 zmax w-full max-w-md`}
        side={`left`}
      >
        <div className="flex flex-col px-2 gap-y-2">
          <div className="flex flex-row items-center">
            <Avatar image={location?.image} />
            <div
              className={`${OutfitFont.className} weight-100 flex flex-col ml-2`}
            >
              <div className="flex flex-col items-start gap-x-2">
                <div className="font-bold text-xl lg:text-2xl">
                  {location?.displayName}
                </div>
                <div>
                  EZH{" "}
                  {location?.role === UserRole.COOP
                    ? "Co-op"
                    : location?.role === UserRole.PRODUCER
                    ? "Producer"
                    : "Member"}{" "}
                  Since {format(location?.createdAt!, "MMM yyyy")}
                </div>
              </div>
            </div>
          </div>
          <h1 className={`text-xl`}>Bio</h1>
          <p className={`h-[50vh] border border-grey p-3 px-4 rounded-xl`}>
            {location?.bio}
          </p>
          {total === 0 ? (
            <div
              className={`${OutfitFont.className} flex justify-center text-2xl mt-5`}
            >
              No reviews found
            </div>
          ) : (
            <>
              <div className="lg:col-span-4 px-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Reviews from Buyers
                </h2>

                <div className="mt-3 flex items-center">
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={classNames(
                            averageRating >= index + 1
                              ? "text-yellow-400"
                              : averageRating >= index + 0.5
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">
                      {averageRating.toFixed(1)} out of 5 stars
                    </p>
                  </div>
                  <p className="ml-2 text-sm text-gray-900">
                    {total !== 1 ? (
                      <>Based on {total} reviews</>
                    ) : (
                      <>Based on {total} review</>
                    )}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="sr-only">Review data</h3>

                  <dl className="space-y-3">
                    {counts.map((count: { rating: number; count: number }) => (
                      <div
                        key={count.rating}
                        className="flex items-center text-sm"
                      >
                        <dt className="flex flex-1 items-center">
                          <p className="w-3 font-medium text-gray-900">
                            {count.rating}
                            <span className="sr-only"> star reviews</span>
                          </p>
                          <div
                            aria-hidden="true"
                            className="ml-1 flex flex-1 items-center"
                          >
                            <StarIcon
                              className={classNames(
                                count.count > 0
                                  ? "text-yellow-400"
                                  : "text-gray-300",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />

                            <div className="relative ml-3 flex-1">
                              <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                              {count.count > 0 ? (
                                <div
                                  className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                  style={{
                                    width: `calc(${count.count} / ${total} * 100%)`,
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </dt>
                        <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                          {count ? (
                            <>{Math.round((count.count / total) * 100)}%</>
                          ) : (
                            <>0%</>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                <h3 className="sr-only">Recent reviews</h3>

                <div className="flow-root">
                  <div className="-my-12 divide-y divide-gray-200">
                    {reviews
                      ? reviews.map((review: ReviewWithReviewer) => {
                          return (
                            <div key={review.id} className="py-12">
                              <div className="flex items-center">
                                {review.reviewer
                                  ? review?.reviewer.name && (
                                      <Avatar image={review.reviewer.image} />
                                    )
                                  : null}
                                <div className="ml-4">
                                  {review.reviewer && (
                                    <h4 className="text-sm font-bold text-gray-900">
                                      {review?.reviewer.name}
                                    </h4>
                                  )}
                                  <div className="mt-1 flex items-center">
                                    {[...Array(5)].map((_, rating) => (
                                      <StarIcon
                                        key={rating}
                                        className={classNames(
                                          review.rating > rating
                                            ? "text-yellow-400"
                                            : "text-gray-300",
                                          "h-5 w-5 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                      />
                                    ))}
                                  </div>
                                  <p className="sr-only">
                                    {review?.rating} out of 5 stars
                                  </p>
                                </div>
                              </div>

                              <div
                                className="mt-4 space-y-6 text-base italic text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: review?.review,
                                }}
                              />
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export { Bio, StoreLocationBio };
