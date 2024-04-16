"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterVendorSchema } from "@/schemas";
import { getUserByEmail, getUserByName } from "@/data/user";
import { Location, UserRole } from "@prisma/client";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (
  values: z.infer<typeof RegisterVendorSchema>
) => {
  const validatedFields = RegisterVendorSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error.issues);
    return { error: "Invalid fields!" };
  }

  const { firstName, email, password, name, location, role, phoneNumber } =
    validatedFields.data;
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
      phoneNumber,
      location: location as Location,
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
