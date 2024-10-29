//dashboard parent element
import { Outfit } from "next/font/google";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getUserWithOrders } from "@/actions/getUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import prisma from "@/lib/prisma";
import Overview from "../update-listing/components/overview";
import DashPopover from "../update-listing/components/dashboard-popover";
import { getFollowers } from "@/actions/getFollow";
import DashboardPopup from "@/app/(white_nav_layout)/info-modals/dashboard-info-modal";
import axios from "axios";
import PayoutButton from "../update-listing/components/payout-button";

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
export type Order = {
  id: string;
  userId: string;
  listingIds: string[];
  sellerId: string;
  pickupDate: Date;
  quantity: string;
  totalPrice: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  fee: number;
  conversationId: string | null;
};
const Dashboard = async () => {
  const followers = await getFollowers();
  const currentUserr = await currentUser();
  let buyOrdersLength = 0;
  let sellOrdersLength = 0;
  let totalSales = 0;
  let recentSales: Order[] = [];
  let recentPurchases: Order[] = [];
  const user = await getUserWithOrders({ userId: currentUserr?.id });
  let balance = null;
  let totalTransferred = 0;

  if (user?.stripeAccountId) {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    balance = await stripe.balance.retrieve({
      stripeAccount: currentUserr?.stripeAccountId,
    });
    console.log(balance);
    const transfers = await stripe.transfers.list({
      destination: currentUserr?.stripeAccountId,
      limit: 1000,
    });

    totalTransferred = transfers.data.reduce(
      (total: number, transfer: { amount: number }) => total + transfer.amount,
      0
    );
  }
  const metadata = {
    title: `${user?.name}'s Dashboard`,
    description:
      "Track your ongoing sell and buy orders, payouts, total sales, and recent transactions from the dashboard.",
    keywords: [
      "registration",
      "seller",
      "vendor",
      "ezh",
      "ezhomesteading",
      "produce near me",
      "virtual farmer's market",
      "fresh food",
      "local food",
      "organic food",
    ],
    openGraph: {
      title: `${user?.name}'s Dashboard`,
      description:
        "Track your ongoing sell and buy orders, payouts, total sales, and recent transactions from the dashboard.",
      url: "https://www.ezhomesteading.com/dashboard",
      type: "website",
    },
  };

  buyOrdersLength =
    user?.buyerOrders?.filter(
      (order) => ![0, 4, 7, 12, 15, 19].includes(order.status)
    ).length ?? 0;
  sellOrdersLength =
    user?.sellerOrders?.filter(
      (order) => ![0, 4, 7, 12, 15, 19].includes(order.status)
    ).length ?? 0;
  // console.log(user?.sellerOrders);
  totalSales = sumTotalPrice(user?.sellerOrders ?? []);
  console.log(totalSales);
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

  const payout = async () => {
    await axios.post("/api/stripe/payout", {
      total: balance.available[0].amount,
      stripeAccountId: currentUserr?.stripeAccountId,
    });
  };
  return (
    <>
      <head>
        {user?.name ? (
          <title className="pwa-title">{metadata.title}</title>
        ) : (
          <title>Dashboard</title>
        )}
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
      </head>
      <main className="grid grid-rows-[auto_auto_1fr] h-auto md:h-[calc(100vh-3rem)]  pt-1 md:pt-12 gap-3 px-3 pb-[5.5rem] md:pb-3 md:grid-rows-[auto_auto_1fr]">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 md:gap-x-3 xl:grid-cols-3 2xl:grid-cols-6">
          {" "}
          {user?.role == UserRole.CONSUMER ? (
            <></>
          ) : (
            <>
              <Card className="w-full h-64 sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
                <CardHeader
                  className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
                >
                  Total Sales
                  <DashPopover c="The amount you've made based on completed orders" />
                </CardHeader>
                <CardContent className="sheet">
                  <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
                    {formatPrice(totalTransferred / 100)}
                  </div>
                  <Link
                    className="flex justify-end items-end"
                    href="/dashboard/my-store/settings"
                  >
                    <Button className="mt-2">
                      {user?.role === UserRole.COOP ? (
                        <>Co-op</>
                      ) : (
                        <>Producer</>
                      )}{" "}
                      Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="w-full h-64 sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
                <CardHeader
                  className={`${outfit.className} text-md md:2xl flex flex-row gap-x-1`}
                >
                  Incoming Payout Total
                  <DashPopover c="Payouts are sent on a weekly basis Wednesday to Wednesday at 12:00AM on Friday. Any complete orders on Thursay or Friday will be paid out the next Friday." />
                </CardHeader>
                <CardContent className="sheet h-fit">
                  <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
                    {balance
                      ? formatPrice(balance.available[0].amount / 100)
                      : 0}
                  </div>
                  <div className="flex justify-end items-end">
                    {" "}
                    <PayoutButton
                      total={balance.available[0].amount}
                      stripeAccountId={currentUserr?.stripeAccountId}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {user?.role == UserRole.CONSUMER ? (
            <></>
          ) : (
            <Card className="w-full sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
              <CardHeader
                className={`${outfit.className} text-md md:2xl flex flex-row gap-x-1`}
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
          <Card className="w-full h-64 sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
            <CardHeader
              className={`${outfit.className} text-md md:2xl flex flex-row gap-x-1`}
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
          <Card className="w-full h-64 sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
            <CardHeader
              className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
            >
              Followers
              <DashPopover c="People who follow you, you cannot remove followers." />
            </CardHeader>
            <CardContent className="sheet">
              <div className="flex items-center justify-center h-full text-4xl md:text-5xl py-4">
                {followers ? followers.length : 0}
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
            <Card className="w-full h-64 sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
              <CardHeader
                className={`${outfit.className} text-[.95rem] 2xl:text-lg flex flex-row gap-x-1`}
              >
                Projected Harvest Payout
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
            <Card className="w-full sheet shadow-[0_0_3px_rgba(0,0,0,.1)] md:col-span-1">
              <CardHeader
                className={`${outfit.className} text-xl md:2xl flex flex-row gap-x-1`}
              >
                Overview
                <DashPopover c="This graph indicates your sales month over month." />
              </CardHeader>
              <CardContent className="sheet p-0 rounded-xl">
                {totalSales === 0 ? (
                  <div className="px-6 pb-6">
                    You have not sold anything yet.
                  </div>
                ) : (
                  <Overview sellerOrders={user?.sellerOrders ?? []} />
                )}
              </CardContent>
            </Card>
          )}
          <Card className="w-full sheet shadow-[0_0_3px_rgba(0,0,0,.1)]">
            <CardHeader className={`${outfit.className} text-xl md:2xl`}>
              Recent Purchases
            </CardHeader>
            <CardContent className="rounded-lg">
              {recentPurchases.length > 0 ? (
                await Promise.all(
                  recentPurchases.map(async (order) => {
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
                            <Avatar image={user?.image} />
                          </div>
                          <div className="flex flex-col ml-2">
                            <strong className="text-lg">{user.name}</strong>{" "}
                            {user.firstName}
                          </div>
                        </div>
                        <div className="text-red-400">
                          -{formatPrice(order.totalPrice)}
                        </div>
                      </div>
                    );
                  })
                )
              ) : (
                <div>No recent purchases</div>
              )}
            </CardContent>
          </Card>
          {user?.role == UserRole.CONSUMER ? (
            <></>
          ) : (
            <Card className="w-full sheet shadow-[0_0_5px_rgba(0,0,0,.1)]">
              <CardHeader className={`${outfit.className} text-xl md:2xl`}>
                Recent Sales
              </CardHeader>
              <CardContent className="rounded-lg">
                {recentSales.length > 0 ? (
                  await Promise.all(
                    recentSales.map(async (order) => {
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
                              <Avatar image={user?.image} />
                            </div>
                            <div className="flex flex-col ml-2">
                              <strong className="text-lg">{user.name}</strong>{" "}
                              {user.firstName}
                            </div>
                          </div>
                          <div className="text-green-500">
                            +{formatPrice(order.totalPrice)}
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  <div>No recent sales</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      {(user?.role === UserRole.COOP || user?.role === UserRole.PRODUCER) && (
        <DashboardPopup />
      )}
    </>
  );
};

export default Dashboard;
