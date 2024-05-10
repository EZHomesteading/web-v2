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
  totalPaidOut?: number;
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
type navBuyOrder = {
  id: string;
  conversationId: string;
  status: number;
  updatedAt: Date;
  buyer: {
    name: string;
  };
};
type navSellOrder = {
  id: string;
  conversationId: string;
  status: number;
  updatedAt: Date;
  seller: {
    name: string;
  };
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
type navUser = {
  id: string;
  name: string;
  firstName?: string;
  image?: string;
  role: UserRole;
  email: string;
  sellerOrders?: navSellOrder[];
  buyerOrders?: navBuyOrder[];
  cart?: nav;
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

declare module "next-auth" {
  interface Session {
    user: UserInfo;
  }
}
