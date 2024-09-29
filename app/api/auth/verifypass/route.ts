import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password, email } = body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await compare(password, user.password);
    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Error verifying password" },
      { status: 500 }
    );
  }
}
