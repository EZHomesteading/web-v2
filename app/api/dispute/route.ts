import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { Location } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();

  const { orderId, email, phone } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const dispute = await prisma.dispute.create({
    data: {},
  });
  return NextResponse.json(dispute);
}
// orderId          String @db.ObjectId @unique
//   email            String
//   phone            String
//   status           Int @default(0)
//   images           String[]
//   reason           DisputeReason
//   explanation      String[]
