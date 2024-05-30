"use server";
//auth action for registering a new coop/producer/vendor
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
  const url = convertToUrl(name);
  const existingName = await getUserByName(name);
  const existingUser = await getUserByEmail(email);
  const existingUrl = await prisma.user.findFirst({
    where: {
      url: {
        equals: url,
        mode: "insensitive",
      },
    },
  });
  if (existingUrl && !existingName) {
    return { error: "Similar display name is already in use" };
  }
  if (existingUser || existingName) {
    return { error: "Email or display name is already in use!" };
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
      url,
    },
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/create-connected-account`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    }
  );

  if (!response.ok) {
    // Handle non-JSON response
    const errorText = await response.text();
    console.error("Error creating Stripe connected account:", errorText);
    return {
      error: "An error occurred while creating the Stripe connected account",
    };
  }
  console.log(response);
  const updatedUser = await response.json();
  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });

  return { user: updatedUser };
};
function convertToUrl(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}
