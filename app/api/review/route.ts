import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import getFollows from "@/actions/follow/getFollows";
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

  const { rating, review, reviewedId, buyer } = await request.json();
  if (user.id === reviewedId) {
    toast.error("cant review own products");
    return;
  }
  const newReview = await prisma.reviews.create({
    data: {
      userId: user.id,
      rating,
      review,
      reviewedId,
      buyer,
    },
  });
  return NextResponse.json(newReview);
}
