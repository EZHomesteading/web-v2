"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { UserRole } from "@prisma/client";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (
  values: z.infer<typeof RegisterSchema>,
  searchParams: string
) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    },
  });

  const params = new URLSearchParams(searchParams);
  const callbackUrl = params.get("callbackUrl");

  await signIn("credentials", {
    email,
    password,
    redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  });

  return { user };
};