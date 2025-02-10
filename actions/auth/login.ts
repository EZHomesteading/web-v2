"use server";
//auth action for logging users in.
import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  let existingUser;

  existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  if (
    (existingUser.role === "COOP" || existingUser.role === "PRODUCER") &&
    !existingUser.stripeAccountId
  ) {
    try {
      const response = await fetch(
        `${process.env.URL}/api/stripe/create-connected-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: existingUser.id }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating Stripe connected account:", errorText);
        return {
          error:
            "An error occurred while creating the Stripe connected account",
        };
      }

      const updatedUser = await response.json();
      existingUser = updatedUser;
    } catch (error) {
      console.error("Error in API call:", error);
      return { error: "Failed to create Stripe account. Please try again." };
    }
  }

  try {
    await signIn("credentials", {
      email: existingUser.email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
