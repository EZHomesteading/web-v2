//extra cart route including a delete all
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

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
  const { quantity, pickup, cartId } = await request.json();
  // Update a single cart item
  if (cartId) {
    const updatedCartItem = await prisma.cart.update({
      where: { id: cartId },
      data: { quantity, pickup },
    });
    return NextResponse.json(updatedCartItem);
  }
}
export async function DELETE() {
  const user = await currentUser();
  if (!user) {
    return;
  }
  // Delete all cart items
  await prisma.cart.deleteMany({ where: { userId: user.id } });

  return NextResponse.json({ message: "Cart item deleted successfully" });
}
