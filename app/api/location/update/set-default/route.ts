import authCache from "@/auth-cache";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest} from 'next/server'
export async function POST(req:NextRequest) {
    const body = await req.json()
    const {userId, locationId} = body
  try {
    const session = await authCache() 
    const locations = await prisma.location.findMany({
        where:{
            userId:userId
        },
        select:{userId:true, isDefault:true, id:true}
    })
    const defaultLoc = locations.find((loc) => loc.isDefault === true);
    const userLoc = locations.find((loc) => loc.id === locationId);
    if (!session || session?.user?.id !== userId || !userLoc) {
        return NextResponse.json({message:"Unauthorized",status:405})
    }
   
    const updatedLocation = await prisma.$transaction(async (tx) => {
      if (defaultLoc) {
        await tx.location.update({
          where: { id: defaultLoc.id },
          data: { isDefault: false }
        });
      }
      return await tx.location.update({
        where: { id: locationId },
        data: { isDefault: true }
      });
    });

    return NextResponse.json(updatedLocation);
  } catch (error) {
    return NextResponse.json(
      { error: "error" },
      { status: 500 }
    );
  }
}