//component to display a users reviews
import Avatar from "@/components/Avatar";
import { OutfitFont } from "@/components/fonts";
import { StarIcon } from "@heroicons/react/20/solid";
import { Reviews, User, UserRole } from "@prisma/client";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Review {
  id: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  review: string;
  buyer: boolean;
  reviewer?: User | null; // Add this if you want to include reviewer data
}

interface ProfileUser {
  id: string;
  name: string;
  //firstName: string | null;
  image: string | null;
  url: string | null;
  createdAt: Date;
}

interface ProfileClientProps {
  user: ProfileUser;
  reviews: Review[];
}

function getReviewCounts(reviews: Reviews[]) {
  const counts = [5, 4, 3, 2, 1].reduce((acc, rating) => {
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

export default function ProfileClient({ user, reviews }: ProfileClientProps) {
  const counts = getReviewCounts(reviews || []);
  const total = reviews.length || 0;
  const averageRating = getAverageRating(reviews || []);
  const hasReviews = reviews && reviews.length > 0;

  return (
    <div className={`${OutfitFont.className} min-h-screen bg`}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-32">
        <div className="flex flex-col lg:col-span-4">
          <div className="flex flex-row items-center mb-2">
            <div>
              <Avatar image={user?.image} />
            </div>
            <div className="flex flex-col ml-2">
              <div className="text-lg lg:text-2xl">{user?.name}</div>
              {user?.name}
            </div>
          </div>
          {user?.url && (
            <Link
              href={`/store/${user?.url}`}
              className="bg-slate-500 rounded-full p-2 text-white w-fit"
            >
              Go to Store
            </Link>
          )}
          {!hasReviews ? (
            <div className="mt-16 ml-2">No reviews from sellers</div>
          ) : (
            <div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-2">
                  Reviews from Sellers
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
                    {total > 1 ? (
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
                          {Math.round((count.count / total) * 100)}%
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>
          <div className="flow-root">
            <div className="-my-12 divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="py-12">
                  <div className="flex flex-col items-start">
                    {review.reviewer ? (
                      <Link
                        href={`/profile/${review.reviewerId}`}
                        className="flex flex-row items-start"
                      >
                        <Avatar image={review.reviewer.image} />
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 flex flex-col ml-2">
                            <h4 className="text-lg">{review.reviewer.name}</h4>
                            {review.reviewer.name}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div>Deleted User</div>
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
                    <p className="sr-only">{review.rating} out of 5 stars</p>
                  </div>
                  <div
                    className="mt-4 space-y-6 text-base italic text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: review.review,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
