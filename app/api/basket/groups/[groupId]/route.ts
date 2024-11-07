// app/api/basket/groups/[groupId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

interface IParams {
  groupId: string;
}

export async function PATCH(request: Request, { params }: { params: IParams }) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { groupId } = params;
    const body = await request.json();
    const { status, pickupDate, deliveryDate, notes, proposedLoc } = body;

    // Only check existence and ownership
    const existingGroup = await prisma.basket.findFirst({
      where: {
        id: groupId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existingGroup) {
      return new NextResponse("Group not found", { status: 404 });
    }

    // Create update data object dynamically
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (pickupDate !== undefined) updateData.pickupDate = new Date(pickupDate);
    if (deliveryDate !== undefined)
      updateData.deliveryDate = new Date(deliveryDate);
    if (notes !== undefined) updateData.notes = notes;
    if (proposedLoc !== undefined) updateData.proposedLoc = proposedLoc;

    // Update with only changed fields
    const updatedGroup = await prisma.basket.update({
      where: { id: groupId },
      data: updateData,
      select: {
        id: true,
        status: true,
        pickupDate: true,
        deliveryDate: true,
        notes: true,
        proposedLoc: true,
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("[WISHLIST_GROUP_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
