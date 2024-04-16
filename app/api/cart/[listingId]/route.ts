import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import getListingById from "@/actions/listing/getListingById";
import toast from "react-hot-toast";

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
      toast.error("Cant add your own products");
      throw new Error("Cant add Own products");
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

  return NextResponse.json({ message: "Cart item(s) deleted successfully" });
}
