import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type UserInfo = DefaultSession["user"] & {
  role: UserRole;
  firstName: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  phoneNumber?: string;
  street?: string;
  city?: string;
  zip?: string;
  state?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  image?: string;
  hoursOfOperation?: unknown;
  stripeAccountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  conversationIds: string[];
  seenMessageIds: string[];
  favoriteIds: string[];
  cartIds: string[];
  subscriptions?: string;
};

declare module "next-auth" {
  interface Session {
    user: UserInfo;
  }
}
