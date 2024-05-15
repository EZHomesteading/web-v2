import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const body = await request.json();

  const { orderId, email, phone, images, reason, explanation } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const dispute = await prisma.dispute.create({
    data: { orderId, email, images, phone, reason },
  });
  return NextResponse.json(dispute);
}
