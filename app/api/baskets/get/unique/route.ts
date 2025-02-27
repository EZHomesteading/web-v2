// get & delete route for /baskets/[id]
import prisma from "@/lib/prisma";
import { Basket_ID_Page } from "basket";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<Basket_ID_Page | NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const basketGroup = await prisma.basket.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });
    if (!basketGroup) {
      return NextResponse.json({ error: "Basket not found" }, { status: 404 });
    }

    if (basketGroup.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to basket" },
        { status: 403 }
      );
    }

    const fullBasketGroup = await prisma.basket.findUnique({
      where: { id },
      select: {
        id: true,
        proposedLoc: true,
        pickupDate: true,
        deliveryDate: true,
        orderMethod: true,
        items: {
          select: {
            quantity: true,
            price: true,
            listing: {
              select: {
                id: true,
                title: true,
                quantityType: true,
                imageSrc: true,
                stock: true,
                price: true,
                SODT: true,
                subCategory: true,
                minOrder: true,
                shelfLife: true,
                rating: true,
                createdAt: true,
              },
            },
          },
        },
        location: {
          select: {
            id: true,
            SODT: true,
            displayName: true,
            image: true,
            type: true,
            coordinates: true,
            address: true,
            hours: true,
            role: true,
            user: {
              select: {
                id: true,
                url: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });
    if (fullBasketGroup?.location?.hours) {
      const hours = fullBasketGroup.location.hours as any;

      if (hours.pickup) {
        hours.pickup.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      if (hours.delivery) {
        hours.delivery.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }
    }
    return NextResponse.json(fullBasketGroup);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch basket" },
      { status: 500 }
    );
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

//         const deletedBasket = await prisma.basketGroup.deleteMany({
//             where: {
//                 AND: [
//                     { id },
//                     { userId: session.user.id }
//                 ]
//             }
//         })

//         if (deletedBasket.count === 0) {
//             return NextResponse.json(
//                 { error: "Basket not found or unauthorized" },
//                 { status: 404 }
//             )
//         }

//         return NextResponse.json({
//             success: true,
//             message: "Basket deleted successfully"
//         })

//     } catch (error) {
//         console.error("Error deleting basket:", error)
//         return NextResponse.json(
//             {
//                 error: "Failed to delete basket",
//                 details: process.env.NODE_ENV === 'development' ? error : undefined
//             },
//             { status: 500 }
//         )
//     }
// }
