import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

interface CartParams {
  cartId?: string;
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: CartParams }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  // Delete the entire cart for the user
  await prisma.cart.deleteMany({
    where: { userId: user.id },
  });

  return NextResponse.json({ message: "Cart item(s) deleted successfully" });
}
