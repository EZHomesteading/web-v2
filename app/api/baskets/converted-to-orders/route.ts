import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import authCache from "@/auth-cache"
import { basketStatus } from "@prisma/client"

export async function GET() {
    const session = await authCache()  

    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    } 

    try {
        const basketGroups = await prisma.basketGroup.findMany({
           where:{
            userId: session?.user?.id,
            status: basketStatus.CONVERTED_TO_ORDER
           } 
        })   

        if (!basketGroups) {
            return NextResponse.json(
                { error: "Wishlist not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(basketGroups)

    } catch (error){
        return NextResponse.json(
            { error: "Failed to fetch basket" },
            { status: 500 }
        )
    }
}