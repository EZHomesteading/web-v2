import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/libs/prismadb";

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

  if (!cartId && listingId && user.id) {
    const createdCartItem = await prisma.cart.create({
      data: {
        userId: user.id,
        listingId,
        quantity,
        pickup,
      },
    });

    return NextResponse.json(createdCartItem);
  }

  // update a single cart item
  if (cartId) {
    const updatedCartItem = await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        quantity,
        pickup,
      },
    });

    return NextResponse.json(updatedCartItem);
  } else {
    const { sellerId, pickup } = await request.json(); // update multiple cart items with the same seller and user (this way if someone buys multiple items from the same seller, they can update the pickup date/time for all of them at once 👍)

    const updatedCartItems = await prisma.cart.updateMany({
      where: {
        userId: user.id,
        listingId: sellerId,
      },
      data: {
        pickup,
      },
    });

    return NextResponse.json(updatedCartItems);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: CartParams }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const { cartId } = params;

  if (cartId) {
    // delete a single cart item
    await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });
  } else {
    await prisma.cart.deleteMany({
      // delete the entire cart for the user
      where: {
        userId: user.id,
      },
    });
  }

  return NextResponse.json({ message: "Cart item(s) deleted successfully" });
}
