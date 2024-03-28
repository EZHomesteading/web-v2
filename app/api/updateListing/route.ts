import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    id,
    description,
    imageSrc,
    category,
    quantityType,
    stock,
    shelfLife,
    price,
    userId,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listing = await prisma.listing.update({
    where: { id: id },
    data: {
      description,
      imageSrc,
      category,
      quantityType,
      stock,
      shelfLife,
      price,
      userId,
    },
  });

  return NextResponse.json(listing);
}
