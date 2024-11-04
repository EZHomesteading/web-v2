import ClientOnly from "@/components/client/ClientOnly";
import ProfileClient from "./ProfileClient";
import { getUserWithBuyReviews } from "@/actions/getUser";
import { User, Reviews } from "@prisma/client";
import { getUserById } from "@/data/user";
import NotFound from "@/app/[...not_found]/page";

interface ReviewWithReviewer extends Reviews {
  reviewer: User | null;
}

type Props = {
  params: { userId: string };
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = params;
  const data = await getUserWithBuyReviews({ userId: userId });

  if (!data || !userId) {
    return <NotFound />;
  }

  const { user, reviews } = data;
  const reviewsWithReviewers: ReviewWithReviewer[] = await Promise.all(
    reviews.map(async (review: any) => {
      const reviewer = await getUserById(review.reviewerId);
      return { ...review, reviewer };
    })
  );

  return (
    <ClientOnly>
      <ProfileClient user={user} reviews={reviewsWithReviewers} />
    </ClientOnly>
  );
}
