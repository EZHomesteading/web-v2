import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    title,
    description,
    imageSrc,
    category,
    quantityType,
    stock,
    shelfLife,
    city,
    state,
    zip,
    street,
    location,
    price,
    subCategory,
    coopRating,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      quantityType,
      stock,
      shelfLife,
      subCategory,
      price,
      street,
      location,
      city,
      state,
      zip,
      coopRating,
      userId: user.id!,
    },
  });
  return NextResponse.json(listing);
}
