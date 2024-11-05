import prisma from "@/lib/prisma";
import { wishlistStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  const {searchParams} = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return null
  }
  try {
    const wishlists = await prisma.wishlistGroup.findMany({
      where: {
        userId: userId,
        status: wishlistStatus.ACTIVE
      },
      select: {
        id:true,
        createdAt:true,
        items:{
          select:{
            listing: {
              select: {
                imageSrc: true
              }
            }
          }
        },
        
        location: {
          select:{
            displayName:true,
            image:true,
            user:{
              select:{
                name:true,
                image:true,
              }
            },
          }
        }
      }
    });
    return NextResponse.json(wishlists);
  } catch (error) {
    return NextResponse.json(
      { error: "" },
      { status: 500 }
    );
  }
}