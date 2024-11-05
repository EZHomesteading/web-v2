import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import authCache from "@/auth-cache"
import { wishlistStatus } from "@prisma/client"

export async function GET() {
    const session = await authCache()  

    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    } 

    try {
        const wishlistGroups = await prisma.wishlistGroup.findMany({
           where:{
            userId: session?.user?.id,
            status: wishlistStatus.CONVERTED_TO_ORDER
           } 
        })   

        if (!wishlistGroups) {
            return NextResponse.json(
                { error: "Wishlist not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(wishlistGroups)

    } catch (error){
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        )
    }
}