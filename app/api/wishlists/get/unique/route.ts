// get & delete route for /wishlists/[id]
import prisma from "@/lib/prisma"
import {  NextResponse } from "next/server"
import { Wishlist_ID_Page } from "wishlist";

export async function GET(request: Request): Promise<Wishlist_ID_Page | NextResponse> {    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId")
    if (!id) {
        return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
        )
    }

    try {
        const wishlistGroup = await prisma.wishlistGroup.findUnique({
            where: { id },
            select:{
                userId:true
            }
        })   
        if (!wishlistGroup) {
            return NextResponse.json(
                { error: "Wishlist not found" },
                { status: 404 }
            )
        }

        if (wishlistGroup.userId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized access to wishlist" },
                { status: 403 }
            )
        }

        const fullWishlistGroup = await prisma.wishlistGroup.findUnique({
            where: { id },
            select: {
                id:true,
                proposedLoc:true,
                pickupDate:true,
                deliveryDate:true,
                orderMethod:true,
                items: {
                    select: {
                        quantity:true,
                        price:true,
                        listing: {
                            select:{
                                id:true,
                                title:true, 
                                quantityType:true,
                                imageSrc:true,
                                stock:true,
                                price:true,
                                minOrder:true,
                                shelfLife:true,
                                rating:true,
                                createdAt:true
                            }
                        }
                    }
                },
                location: {
                    select: {
                        id:true,
                        displayName:true,
                        image:true,
                        type:true,
                        coordinates:true,
                        address:true,
                        hours:true,
                        role:true,
                        user: {
                            select: {
                                url:true,
                                name:true,
                            }
                        }
                    }
                }
            } 
        })
        return NextResponse.json(fullWishlistGroup)

    } catch (error){
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        )
    }
}

// export async function DELETE({ params }: { params: { id: string } }) {
//     try {
//         const session = await authCache()  

//         if (!session?.user) {
//             return NextResponse.json(
//                 { error: "Unauthorized" },
//                 { status: 401 }
//             )
//         } 

//         const id = params.id

//         if (!id) {
//             return NextResponse.json(
//                 { error: "ID is required" },
//                 { status: 400 }
//             )
//         }

//         const deletedWishlist = await prisma.wishlistGroup.deleteMany({
//             where: {
//                 AND: [
//                     { id },
//                     { userId: session.user.id }
//                 ]
//             }
//         })

//         if (deletedWishlist.count === 0) {
//             return NextResponse.json(
//                 { error: "Wishlist not found or unauthorized" },
//                 { status: 404 }
//             )
//         }

//         return NextResponse.json({ 
//             success: true, 
//             message: "Wishlist deleted successfully" 
//         })

//     } catch (error) {
//         console.error("Error deleting wishlist:", error)
//         return NextResponse.json(
//             { 
//                 error: "Failed to delete wishlist",
//                 details: process.env.NODE_ENV === 'development' ? error : undefined
//             },
//             { status: 500 }
//         )
//     }
// }