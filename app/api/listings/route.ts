//creates listing
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { Location } from "@prisma/client";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    title,
    SODT,
    description,
    imageSrc,
    category,
    quantityType,
    stock,
    shelfLife,
    minOrder,
    location,
    price,
    subCategory,
    rating,
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
      SODT,
      imageSrc,
      category,
      quantityType,
      stock,
      shelfLife,
      subCategory,
      price,
      minOrder,
      location,
      rating,
      userId: user.id!,
    },
  });
  return NextResponse.json(listing);
}
