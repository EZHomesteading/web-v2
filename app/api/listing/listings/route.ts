//creates listing
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    keyWords,
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
    harvestDates,
    projectedStock,
    harvestFeatures,
    price,
    subCategory,
    rating,
    review,
    reports,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });
  if (review !== null && harvestFeatures !== true) {
    const listing = await prisma.listing.create({
      data: {
        keyWords,
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
        review,
        reports,
        userId: user.id!,
      },
    });
    return NextResponse.json(listing);
  } else if (harvestFeatures !== true) {
    const listing = await prisma.listing.create({
      data: {
        keyWords,
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
  } else {
    const listing = await prisma.listing.create({
      data: {
        keyWords,
        title,
        description,
        SODT,
        imageSrc,
        category,
        quantityType,
        harvestDates,
        projectedStock,
        harvestFeatures,
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
}
