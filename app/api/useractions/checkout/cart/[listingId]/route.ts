// route to create update and delete users carts, with logic to prevent producers from adding other producers items. consumers from buying producers items
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { getListingById } from "@/actions/getListings";
interface CartParams {
  cartId?: string;
  listingId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: CartParams }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const { cartId, listingId } = params;
  const { quantity, pickup } = await request.json();
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  if (!cartId && listingId && user.id) {
    const listing = await getListingById({ listingId });
    if (!listing) {
      return NextResponse.error();
    }
    if (listing.userId === user.id) {
      return NextResponse.json(
        { error: "Can't add your own listings to cart" },
        { status: 400 }
      );
    }
    if (
      (listing.user.role === "PRODUCER" && user.role === "PRODUCER") ||
      (listing.user.role === "PRODUCER" && user.role === "CONSUMER") ||
      (listing.user.role === "PRODUCER" && !user)
    ) {
      return NextResponse.json(
        {
          error: "Must be a Co-Op to add Producers listings",
        },
        { status: 400 }
      );
    }

    const createdCartItem = await prisma.cart.create({
      data: {
        userId: user.id,
        listingId,
        quantity,
        pickup,
        price: listing.price * quantity,
      },
      include: {
        user: true,
        listing: true,
      },
    });
    return NextResponse.json(createdCartItem);
  }

  //??Not sure thsi code block is ever used??
  // Update a single cart item
  if (cartId) {
    const updatedCartItem = await prisma.cart.update({
      where: { id: cartId },
      data: { quantity, pickup },
    });
    return NextResponse.json(updatedCartItem);
  } else {
    const { sellerId, pickup } = await request.json();
    // Update multiple cart items with the same seller and user
    const updatedCartItems = await prisma.cart.updateMany({
      where: {
        userId: user.id,
        listingId: sellerId,
      },
      data: { pickup },
    });
    return NextResponse.json(updatedCartItems);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: CartParams }
) {
  const { listingId } = params;
  // Delete a single cart item
  await prisma.cart.delete({ where: { id: listingId } });

  return NextResponse.json({ message: "Cart item deleted successfully" });
}
