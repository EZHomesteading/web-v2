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
import Overview from "@/app/dashboard/overview";
import DashPopover from "./dashboard-popover";
import getFollowersInt from "@/actions/follow/getFollowersInt";
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
  const followers = await getFollowersInt();
  console.log(followers);
  const currentUserr = await currentUser();
  let buyOrdersLength = 0;
  let sellOrdersLength = 0;
  let totalSales = 0;
  let recentSales: Order[] = [];
  let recentPurchases: Order[] = [];
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
      .slice(0, 6) ?? [];
  recentPurchases =
    user?.buyerOrders
      ?.filter((order) => {
        const { status } = order;
        return status === 9 || (status >= 16 && status <= 19);
      })
      .slice(0, 6) ?? [];
  return (
    <main className="grid grid-rows-[auto_auto_1fr] h-fit md:h-screen pt-1 md:pt-12 gap-3 px-3 pb-3 md:grid-rows-[auto_auto_1fr]">
      <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-x-3">
        {" "}
        {user?.role == UserRole.CONSUMER ? (
          <></>
        ) : (
          <Card className="w-full aspect-video sheet shadow-lg">
            <CardHeader
              className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
            >
              Total Sales
              <DashPopover c="The amount you've made based on completed orders" />
            </CardHeader>
            <CardContent className="sheet h-fit">
              <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
                {formatPrice(totalSales)}
              </div>
              <Link
                className="flex justify-end items-end"
                href="/dashboard/my-store/settings"
              >
                <Button className="mt-2">
                  {user?.role === UserRole.COOP ? <>Co-op</> : <>Producer</>}{" "}
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
        {user?.role == UserRole.CONSUMER ? (
          <></>
        ) : (
          <Card className="w-full sheet shadow-lg">
            <CardHeader
              className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
            >
              Ongoing Sell Orders
              <DashPopover c="Check all store orders and reply to buyer messages." />
            </CardHeader>
            <CardContent className="sheet">
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
        )}
        <Card className="w-full aspect-video sheet shadow-lg">
          <CardHeader
            className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
          >
            Ongoing Buy Orders
            <DashPopover c="Check your orders and reply to seller messages." />
          </CardHeader>
          <CardContent className="sheet">
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
          <CardHeader
            className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
          >
            Followers{" "}
            <DashPopover c="People who follow you, you cannot remove followers." />
          </CardHeader>
          <CardContent className="sheet">
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
              {followers}
            </div>
            <Link
              className="flex justify-end items-end"
              href="/dashboard/followers"
            >
              <Button className="mt-2">See Who Follows You</Button>
            </Link>
          </CardContent>
        </Card>
        {user?.role == UserRole.CONSUMER ? (
          <></>
        ) : (
          <Card className="w-full aspect-video sheet shadow-lg">
            <CardHeader
              className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
            >
              Projected Harvest Payout{" "}
              <DashPopover c="This number is estimated based on the value and quantity of your your projected harvest & assumes you sell all of it." />
            </CardHeader>
            <CardContent className="sheet">
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
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {user?.role == UserRole.CONSUMER ? (
          <></>
        ) : (
          <Card className="w-full sheet shadow-lg md:col-span-1">
            <CardHeader
              className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
            >
              Overview
              <DashPopover c="This graphy indicates your sales month over month." />
            </CardHeader>
            <CardContent className="sheet p-0">
              <Overview sellerOrders={user?.sellerOrders ?? []} />
            </CardContent>
          </Card>
        )}
        <Card className="w-full sheet shadow-lg">
          <CardHeader className={`${outfit.className} text-xl md:2xl`}>
            Recent Purchases
          </CardHeader>
          <CardContent className="sheet">
            {(() => {
              const userElements = recentPurchases.map(async (order) => {
                const user = await prisma.user.findUnique({
                  where: { id: order.sellerId },
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
                    <div className="text-red-400">
                      -{formatPrice(order.totalPrice * 10)}
                    </div>
                  </div>
                );
              });
              return Promise.all(userElements);
            })()}
          </CardContent>
        </Card>
        {user?.role == UserRole.CONSUMER ? (
          <></>
        ) : (
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
        )}
      </div>
    </main>
  );
};

export default Dashboard;
