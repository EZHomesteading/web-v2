//route to create reviews
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import toast from "react-hot-toast";

interface IParams {}

export async function POST(request: Request, { params }: { params: IParams }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }
  if (!user.id) {
    return NextResponse.error();
  }

  const { rating, review, sellerId, buyerId, reviewerId } =
    await request.json();
  if (user.id === sellerId && user.id === buyerId) {
    toast.error("cant review own products");
    return;
  }
  const newReview = await prisma.reviews.create({
    data: {
      buyerId,
      sellerId,
      reviewerId,
      review,
      rating,
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
