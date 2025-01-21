import { Location, Order, OrderStatus, User } from "@prisma/client";
import prisma from "@/lib/prismadb";
export type OrderMap = {
  id: string;
  pickupDate: Date | null;
  location: { displayName: string; coordinates: number[]; address: string[] };
};

export async function getActivePickupOrders(
  userId: string
): Promise<{ orders: OrderMap[] }> {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
      fulfillmentType: "PICKUP",
      status: {
        notIn: ["COMPLETED", "CANCELED", "DISPUTED", "REFUNDED"],
      },
    },
    select: {
      id: true,
      sellerId: true,
      userId: true,
      pickupDate: true,
      totalPrice: true,
      fulfillmentType: true,
      locationId: true,
      conversationId: true,
      paymentIntentId: true,
      proposedLoc: true,
      fee: true,
      items: true,
      status: true,
      preferredLocationId: true,
      seller: {
        select: {
          name: true,
        },
      },
    },
  });

  const ordersWithLocations = await Promise.all(
    orders.map(async (order) => {
      let location: Location | null = null;

      if (!order.proposedLoc) {
        if (order.preferredLocationId) {
          const locationData = await prisma.location.findUnique({
            where: {
              id: order.preferredLocationId,
            },
            select: {
              id: true,
              userId: true,
              displayName: true,
              type: true,
              coordinates: true,
              address: true,
              role: true,
              SODT: true,
              bio: true,
              isDefault: true,
              showPreciseLocation: true,
              createdAt: true,
              updatedAt: true,
              hours: true,
            },
          });

          if (locationData) {
            location = locationData as Location;
          }
        } else if (order.locationId) {
          const locationData = await prisma.location.findUnique({
            where: {
              id: order.locationId,
            },
            select: {
              id: true,
              userId: true,
              displayName: true,
              type: true,
              coordinates: true,
              address: true,
              role: true,
              SODT: true,
              bio: true,
              isDefault: true,
              showPreciseLocation: true,
              createdAt: true,
              updatedAt: true,
              hours: true,
            },
          });

          if (locationData) {
            location = locationData as Location;
          }
        }
      } else {
        location = order.proposedLoc as Location;
      }

      if (!location) {
        return null;
      }

      // Transform to OrderMap format
      const orderMap: OrderMap = {
        id: order.id,
        pickupDate: order.pickupDate,
        location: {
          displayName: location.displayName || order.seller.name,
          coordinates: location.coordinates,
          address: location.address,
        },
      };

      return orderMap;
    })
  );

  // Filter out null values and return valid orders
  return {
    orders: ordersWithLocations.filter(
      (order): order is OrderMap => order !== null
    ),
  };
}
