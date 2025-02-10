"use server";
// auth action for registering a new coop/producer/vendor
import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterVendorSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { Location, UserRole } from "@prisma/client";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (
  values: z.infer<typeof RegisterVendorSchema>
) => {
  const validatedFields = RegisterVendorSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.issues);
    return { error: "Invalid fields!" };
  }

  const { firstName, email, password, name, role, phoneNumber } =
    validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const url = await generateUniqueUrl(name);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email is already in use!" };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phoneNumber,
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

  const updatedUser = await response.json();
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/onboard",
  });

  return { user: updatedUser };
};

async function generateUniqueUrl(displayName: string): Promise<string> {
  let url = convertToUrl(displayName);
  let uniqueUrl = url;

  while (true) {
    const existingUrl = await prisma.user.findFirst({
      where: {
        url: {
          equals: uniqueUrl,
          mode: "insensitive",
        },
      },
    });

    if (!existingUrl) {
      break;
    }

    uniqueUrl = `${url}`;

    const existingCityUrl = await prisma.user.findFirst({
      where: {
        url: {
          equals: uniqueUrl,
          mode: "insensitive",
        },
      },
    });

    if (!existingCityUrl) {
      break;
    }

    let counter = 1;
    let numberAppended = false;

    while (true) {
      const randomNumber = Math.floor(Math.random() * 10);
      const urlWithNumber = numberAppended
        ? `${uniqueUrl}${randomNumber}`
        : `${uniqueUrl}-${randomNumber}`;

      const existingUrlWithNumber = await prisma.user.findFirst({
        where: {
          url: {
            equals: urlWithNumber,
            mode: "insensitive",
          },
        },
      });

      if (!existingUrlWithNumber) {
        uniqueUrl = urlWithNumber;
        break;
      }

      numberAppended = true;
      counter++;
    }
  }

  return uniqueUrl;
}

function convertToUrl(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}
