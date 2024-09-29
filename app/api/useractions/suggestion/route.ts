import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, subCategory, category } = body;
  const suggestion = await prisma.suggestion.create({
    data: {
      name,
      subCategory,
      category,
    },
  });
  return NextResponse.json(suggestion);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  await prisma.suggestion.delete({
    where: {
      id: id,
    },
  });
  return null;
}
