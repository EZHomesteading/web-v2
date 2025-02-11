// actions/getOrderGroupWithOrders.ts
import { OrderMap } from "@/app/(white_nav_layout)/map/checkmap/page";
import prisma from "@/lib/prisma";

export async function getOrderGroupWithOrders(ordergroupId: string) {
  try {
    const orderGroup = await prisma.orderGroup.findUnique({
      where: { id: ordergroupId },
      select: {
        id: true,
        orderids: true,
        startLoc: true,
        endLoc: true,
      },
    });

    if (!orderGroup) return { orders: [], startLoc: [], endLoc: [] };

    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderGroup.orderids },
      },
      select: {
        id: true,
        pickupDate: true,

        location: {
          select: {
            user: { select: { name: true } },
            displayName: true,
            coordinates: true,
            address: true,
          },
        },
      },
    });

    const mappedOrders: OrderMap[] = orders.map((order) => ({
      id: order.id,
      pickupDate: order.pickupDate || new Date(),
      name: order.location?.user.name,
      location: order.location
        ? {
            displayName: order.location.displayName || "",
            coordinates: order.location.coordinates,
            address: order.location.address,
          }
        : {
            displayName: "",
            coordinates: [0, 0],
            address: [""],
          },
    }));

    return {
      orders: mappedOrders,
      startLoc: orderGroup.startLoc,
      endLoc: orderGroup.endLoc,
    };
  } catch (error) {
    console.error("Error:", error);
    return { orders: [], startLoc: [], endLoc: [] };
  }
}
