import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  phoneNumber: string | null;
  street: string | null;
  city: string | null;
  zip: string | null;
  state: string | null;
  location: any | null;
  image: string | null;
  hoursOfOperation: any | null;
  role: UserRole;
  password: string | null;
  stripeAccountId: string | null;
  createdAt: Date;
  updatedAt: Date;
  conversationIds: string[];
  seenMessageIds: string[];
  favoriteIds: string[];
  cartIds: string[];
  isOAuth: boolean;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
