// route to follow users
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
