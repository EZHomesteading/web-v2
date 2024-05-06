import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import toast from "react-hot-toast";
import getFollows from "@/actions/getFollows";

interface IParams {
  follows?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }
  if (!user.id) {
    return NextResponse.error();
  }
  const following = await getFollows();
  const { follows } = await request.json();
  if (!following) {
    const createdCartItem = await prisma.following.create({
      data: {
        userId: user.id,
        follows: [follows],
      },
    });
    return NextResponse.json(createdCartItem);
  } else {
    if (following) {
      const updatedCartItem = await prisma.following.update({
        where: { id: following.id },
        data: { follows: [...following.follows, follows] },
      });
      return NextResponse.json(updatedCartItem);
    }
  }
}

export async function UPDATE(
  request: Request,
  { params }: { params: IParams }
) {
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
  console.log(newFollows);
  await prisma.following.update({
    where: { userId: user.id },
    data: { follows: newFollows },
  });

  return NextResponse.json({ message: "Cart item deleted successfully" });
}
