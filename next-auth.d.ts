import { Cart, Hours, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type UserInfo = DefaultSession["user"] & {
  role: UserRole;
  firstName: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  phoneNumber?: string;
  image?: string;
  location?: Location;
  hours?: Hours;
  stripeAccountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  conversationIds: string[];
  seenMessageIds: string[];
  favoriteIds: string[];
  subscriptions?: string;
  cart?: Cart[];
};

type Location = {
  type: string;
  coordinates: number[];
  address: string[];
};
type CartGroup = {
  expiry?: date;
  cartIndex?: number;
};

type CartGroups = {
  cartGroup: CartGroup[];
};

declare module "next-auth" {
  interface Session {
    user: UserInfo;
  }
}
