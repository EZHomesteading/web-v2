import {
  Cart,
  DayHours,
  Hours,
  LocationObj,
  Notification,
  UserRole,
} from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type UserInfo = DefaultSession["user"] & {
  role: UserRole;
  firstName: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  phoneNumber?: string;
  image?: string;
  url?: string;
  stripeAccountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  conversationIds: string[];
  seenMessageIds: string[];
  favoriteIds: string[];
  subscriptions?: string;
  totalPaidOut?: number;
  notifications?: Notification;
  SODT?: number;
  bio?: string;
  banner?: string;
  hasPickedRole?: boolean;
  openClosedTemplates?:DayHours[];
};

type navSellOrder = {
  id: string;
  conversationId: string | null;
  status: number;
  updatedAt: Date;
  seller: {
    name: string;
  } | null;
  buyer: {
    name: string;
  } | null;
};

type navBuyOrder = {
  id: string;
  conversationId: string | null;
  status: number;
  updatedAt: Date;
  seller: {
    name: string;
  } | null;
  buyer: {
    name: string;
  } | null;
};

type navListing = {
  imageSrc: string;
  quantityType: string;
  title: string;
  user: {
    id: string;
    name: string;
  };
};

type navCart = {
  id: string;
  quantity: number;
  listing: navListing[];
};

type CartGroup = {
  expiry?: date;
  cartIndex?: number;
};

type CartGroups = {
  cartGroup: CartGroup[];
};

type UserWithCart = UserInfo & {
  cart: Cart;
};

declare module "next-auth" {
  interface Session {
    user: UserInfo;
  }
}
