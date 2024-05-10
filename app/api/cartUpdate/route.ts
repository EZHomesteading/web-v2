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
