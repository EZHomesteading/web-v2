import { Button } from "@/app/components/ui/button";
import VerificationStatus from "./verification-status";
import { currentUser } from "@/lib/auth";
import { PrismaClient, UserRole } from "@prisma/client";
import Link from "next/link";
import OrderSummary from "./order-summary";

const TodaysObligationsPage = async () => {
  const total = 0;
  const user = await currentUser();
  const prisma = new PrismaClient();
  const orders = await prisma.order.findMany({
    where: {
      pickupDate: new Date(),
      OR: [{ sellerId: user?.id }],
    },
  });
  return (
    <>
      <h1 className="text-2xl font-medium pb-0">Today's Obligations</h1>
      <VerificationStatus />
      <div className="flex justify-between">
        <h2 className="text-xl font-normal py-3">Sale Orders</h2>
        <Link href="/orders">
          <button className="border-b">All Orders</button>
        </Link>
      </div>

      <OrderSummary user={user} orders={orders} />
    </>
  );
};
export default TodaysObligationsPage;
