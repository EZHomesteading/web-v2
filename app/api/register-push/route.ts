//register and delete push notification subscriptions. via service worker.
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { PushSubscription } from "web-push";
import { filter } from "lodash";

export async function POST(request: Request) {
  const body: PushSubscription = await request.json();
  const parsed = JSON.stringify([body]);
  const endpoint = body.endpoint;
  const user = await currentUser();

  if (!user) {
    return NextResponse.error();
  }
  if (!body) {
    return NextResponse.error();
  }
  const subs = (user.subscriptions as string) || "[]";
  // if (subs === "[]") {
  //   const updatedUser = await prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       subscriptions: parsed,
  //     },
  //   });

  //   return NextResponse.json(updatedUser);
  // }

  const filterMe = JSON.parse(subs);
  const updatesubscriptions = filterMe.filter(
    (subscription: PushSubscription) => subscription.endpoint !== endpoint
  );
  updatesubscriptions.push(body);
  console.log("filterme", filterMe, "updatesubscriptions", updatesubscriptions);
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptions: JSON.stringify(updatesubscriptions),
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request) {
  const body: PushSubscription = await request.json();

  const endpoint = body.endpoint;
  const user = await currentUser();

  if (!user) {
    return NextResponse.error();
  }
  if (!body) {
    return NextResponse.error();
  }
  const subs = user.subscriptions || "[]";
  const filterMe = JSON.parse(subs);
  const updatesubscriptions = filterMe.filter(
    (subscription: PushSubscription) => subscription.endpoint !== endpoint
  );
  console.log(filterMe);
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      subscriptions: JSON.stringify(updatesubscriptions),
    },
  });

  return NextResponse.json(updatedUser);
}
