//route to unfollow users
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { getFollows } from "@/actions/getFollow";

interface IParams {
  follows?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const following = await getFollows();
  if (!following) {
    return;
  }
  const { follows } = await request.json();
  if (!follows) {
    return;
  }
  const newFollows = following.follows.filter((id) => id !== follows);
  // Delete a single cart item
  await prisma.following.update({
    where: { userId: user.id },
    data: { follows: newFollows },
  });

  return NextResponse.json({ message: "follow removed" });
}
