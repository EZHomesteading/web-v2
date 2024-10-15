import VerificationStatus from "./verification-status";
import { currentUser } from "@/lib/auth";
import { PrismaClient, UserRole } from "@prisma/client";
import Link from "next/link";
import OrderSummary from "./order-summary";

const TodaysObligationsPage = async () => {
  const user = await currentUser();
  const prisma = new PrismaClient();
  const orders = await prisma.order.findMany({
    where: {
      sellerId: user?.id,
    },
  });
  const allListingIds = [
    ...new Set(orders.flatMap((order) => order.listingIds)),
  ];
  const allListings = await prisma.listing.findMany({
    where: {
      id: {
        in: allListingIds,
      },
    },
    select: {
      id: true,
      title: true,
      quantityType: true,
      imageSrc: true,
    },
  });

  const listingMap = new Map(
    allListings.map((listing) => [listing.id, listing])
  );

  const ordersWithListings = orders.map((order) => ({
    ...order,
    listings: order.listingIds.map((id) => listingMap.get(id)).filter(Boolean),
  }));
  const newOrders = ordersWithListings.filter((order) => order.status === 1);
  const pendingResponse = ordersWithListings.filter(
    (order) => order.status === 6
  );
  const pendingDelivery = ordersWithListings.filter(
    (order) => order.status === 10 || order.status === 13
  );
  const pendingSetOutConfirmation = ordersWithListings.filter(
    (order) => order.status === 2 || order.status === 5
  );
  return (
    <div className="px:1 md:p-2 lg:p-4 xl:p-6">
      <h1 className="text-2xl font-medium pb-0">Today's Obligations</h1>
      <VerificationStatus />
      <div className="flex justify-between">
        <h2 className="text-xl font-normal py-3">Sale Orders</h2>
        <Link href="/orders">
          <button className="border-b">All Orders</button>
        </Link>
      </div>

      <OrderSummary
        user={user}
        orders={ordersWithListings}
        newOrders={newOrders}
        pendingSetOutConfirmation={pendingSetOutConfirmation}
        pendingResponse={pendingResponse}
        pendingDelivery={pendingDelivery}
      />
    </div>
  );
};
export default TodaysObligationsPage;
