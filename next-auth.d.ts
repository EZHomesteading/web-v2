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

type Times = {
  open: number;
  close: number;
};

type Hours = {
  0: Times[];
  1: Times[];
  2: Times[];
  3: Times[];
  4: Times[];
  5: Times[];
  6: Times[];
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
interface ExtendedHours extends Hours {
  [key: number]: { open: number; close: number }[] | null;
}
type CartGroups = {
  cartGroup: CartGroup[];
};

type Order = {
  id: string;
  userId: string;
  listingIds: string[];
  sellerId: string;
  pickupDate: Date;
  quantity: string;
  totalPrice: number;
  status: number;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  stripeSessionId: string;
  fee: number;
  conversationId: string | null;
};

export type UserInfoOrders = UserInfo & {
  buyerOrders?: Order[];
  sellerOrders?: Order[];
};

declare module "next-auth" {
  interface Session {
    user: UserInfo;
  }
}
