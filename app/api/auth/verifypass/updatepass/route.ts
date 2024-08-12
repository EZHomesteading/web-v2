import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password2, email } = body;

    if (!password2 || !email) {
      return NextResponse.json(
        { error: "Password and email are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password2, 10);

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: "Password updated!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Error updating password" },
      { status: 500 }
    );
  }
}
