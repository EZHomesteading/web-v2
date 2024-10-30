// route to update a listing
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

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
    title,
    emailList,
    rating,
    SODT,
    minOrder,
    location,
    projectedStock,
    harvestDates,
    harvestFeatures,
    harvestType,
    reports,
    review,
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
      projectedStock,
      harvestDates,
      harvestType,
      harvestFeatures,
      stock,
      shelfLife,

      price,
      userId,
      title,
      emailList,
      rating,
      SODT,
      minOrder,
      reports,
      review,
      ...(location !== undefined && {
        location: {
          connect: {
            id: location,
          },
        },
      }),
    },
  });

  return NextResponse.json(listing);
}
