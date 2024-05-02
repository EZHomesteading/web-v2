import { Outfit } from "next/font/google";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { currentUser } from "@/lib/auth";
import { Order, UserRole } from "@prisma/client";
import getUserWithBuyOrders from "@/actions/user/getUserWithBuyOrders";
import getUserWithOrders from "@/actions/user/getUserWithOrders";
import Link from "next/link";
import { Button } from "../components/ui/button";
import Avatar from "../components/Avatar";
import prisma from "@/lib/prisma";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
const sumTotalPrice = (sellerOrders: Order[]): number => {
  const filteredOrders = sellerOrders.filter((order) => {
    const { status } = order;
    return status === 9 || (status >= 16 && status <= 19);
  });

  const totalSales = filteredOrders.reduce((sum, order) => {
    return sum + order.totalPrice;
  }, 0);

  return totalSales;
};
const Dashboard = async () => {
  const currentUserr = await currentUser();
  let buyOrdersLength = 0;
  let sellOrdersLength = 0;
  let totalSales = 0;
  let recentSales: Order[] = [];
  if (currentUserr?.role === UserRole.CONSUMER) {
    const user = await getUserWithBuyOrders({ userId: currentUserr?.id });
    buyOrdersLength =
      user?.buyerOrders?.filter(
        (order) => ![0, 4, 7, 12, 15, 19].includes(order.status)
      ).length ?? 0;
  } else {
    const user = await getUserWithOrders({ userId: currentUserr?.id });
    buyOrdersLength =
      user?.buyerOrders?.filter(
        (order) => ![0, 4, 7, 12, 15, 19].includes(order.status)
      ).length ?? 0;
    sellOrdersLength =
      user?.sellerOrders?.filter(
        (order) => ![0, 4, 7, 12, 15, 19].includes(order.status)
      ).length ?? 0;
    totalSales = sumTotalPrice(user?.sellerOrders ?? []);
    totalSales = totalSales * 10;
    recentSales =
      user?.sellerOrders
        ?.filter((order) => {
          const { status } = order;
          return status === 9 || (status >= 16 && status <= 19);
        })
        .slice(0, 5) ?? [];
  }
  return (
    <main className="grid grid-rows-[auto_auto_1fr] h-fit md:h-screen pt-1 md:pt-12 gap-3 px-3 pb-3 md:grid-rows-[auto_auto_1fr]">
      <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-x-3">
        <Card className="w-full aspect-video sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Total Sales
          </CardHeader>
          <CardContent className="sheet h-fit">
            Sales based on complete orders from store
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
              {formatPrice(totalSales)}
            </div>
            <Link
              className="flex justify-end items-end"
              href="/dashboard/my-store/settings"
            >
              <Button className="mt-2">Store Settings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Ongoing Sell Orders
          </CardHeader>
          <CardContent className="sheet">
            Incomplete orders placed on your store
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
              {sellOrdersLength}
            </div>
            <Link
              className="flex justify-end items-end"
              href="/dashboard/orders/seller"
            >
              <Button className="mt-2">Go to Sell Orders</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full aspect-video sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Ongoing Buy Orders
          </CardHeader>
          <CardContent className="sheet">
            Incomplete orders you created
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
              {buyOrdersLength}
            </div>
            <Link
              className="flex justify-end items-end"
              href="/dashboard/orders/buyer"
            >
              <Button className="mt-2">Go to Buy Orders</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full aspect-video sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Followers
          </CardHeader>
          <CardContent className="sheet">
            How many people follow you
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
              0
            </div>
            <Link
              className="flex justify-end items-end"
              href="/dashboard/followers"
            >
              <Button className="mt-2">See Who Follows You</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="w-full aspect-video sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Projected Harvest Payout
          </CardHeader>
          <CardContent className="sheet">
            Based on selling your projected harvest
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
              $0.00
            </div>
            <Link
              className="flex justify-end items-end"
              href="/project-harvest"
            >
              <Button className="mt-2">Project for Next Season</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="w-full sheet shadow-lg md:col-span-2">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Overview
          </CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
        <Card className="w-full sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Recent Sales
          </CardHeader>
          <CardContent className="sheet">
            {(() => {
              const userElements = recentSales.map(async (order) => {
                const user = await prisma.user.findUnique({
                  where: { id: order.userId },
                  select: {
                    id: true,
                    name: true,
                    firstName: true,
                    image: true,
                  },
                });
                if (!user) return null;
                return (
                  <div
                    key={order.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex flex-row items-center">
                      <div>
                        <Avatar user={user} />
                      </div>
                      <div className="flex flex-col ml-2">
                        <strong className="text-lg">{user.name}</strong>{" "}
                        {user.firstName}
                      </div>
                    </div>
                    <div className="text-green-500">
                      +{formatPrice(order.totalPrice * 10)}
                    </div>
                  </div>
                );
              });
              return Promise.all(userElements);
            })()}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
