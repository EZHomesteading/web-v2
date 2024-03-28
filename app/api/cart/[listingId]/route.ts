import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let cartIds = [...(user.cartIds || [])];

  cartIds.push(listingId);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      cartIds,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let cartIds = [...(user.cartIds || [])];

  cartIds = cartIds.filter((id) => id !== listingId);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      cartIds,
    },
  });

  return NextResponse.json(updatedUser);
}
