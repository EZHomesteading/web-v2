import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface DeleteParams {
  userId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: DeleteParams }
) {
  const { userId } = params;
  if (userId) {
    await prisma.cart.deleteMany({
      where: { userId },
    });
    return NextResponse.json({ message: "Cart item(s) deleted successfully" });
  } else {
    return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
  }
}
