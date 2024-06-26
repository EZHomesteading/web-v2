import ClientOnly from "@/app/components/client/ClientOnly";
import ProfileClient from "./ProfileClient";
import { getUserWithBuyReviews } from "@/actions/getUser";
import { User, Reviews } from "@prisma/client";
import { getUserById } from "@/data/user";

interface ReviewWithReviewer extends Reviews {
  reviewer: User | null;
}

type Props = {
  params: { userId: string };
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = params;
  const data = await getUserWithBuyReviews({ userId: userId });

  if (!data) {
    return <div>No user found</div>;
  }

  const { user, reviews } = data;
  const reviewsWithReviewers: ReviewWithReviewer[] = await Promise.all(
    reviews.map(async (review) => {
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
