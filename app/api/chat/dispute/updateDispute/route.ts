import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, status } = body;

  const Dispute = await prisma.dispute.update({
    where: { orderId: orderId },
    data: {
      status: status,
    },
  });
  return NextResponse.json(Dispute);
}
