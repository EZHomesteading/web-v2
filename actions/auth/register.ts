"use server";
//auth action for registering a new consumer/regular account
import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail, getUserByName } from "@/data/user";
import { UserRole } from "@prisma/client";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { firstName, email, password, name, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingName = await getUserByName(name);
  const existingUser = await getUserByEmail(email);

  if (existingUser || existingName) {
    return { error: "Email or username already in use!" };
  }

  const user = await prisma.user.create({
    data: {
      firstName,
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });

  return { user };
};
