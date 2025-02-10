//route to create reviews
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

interface IParams {}

export async function POST(request: Request, { params }: { params: IParams }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }
  if (!user.id) {
    return NextResponse.error();
  }

  const { rating, review, reviewedId, reviewerId, buyer } =
    await request.json();
  if (user.id === reviewedId && buyer === true) {
    return;
  }
  const newReview = await prisma.reviews.create({
    data: {
      reviewedId,
      reviewerId,
      review,
      rating,
      buyer,
    },
  });
  return NextResponse.json(newReview);
}
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }
  if (!user.id) {
    return NextResponse.error();
  }

  const { reviewId } = await request.json();

  const Review = await prisma.reviews.delete({
    where: {
      id: reviewId,
      reviewerId: user.id,
    },
  });
  return NextResponse.json(Review);
}
