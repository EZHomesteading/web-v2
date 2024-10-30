import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole, Notification, fullName, Location } from "@prisma/client";

declare module "next-auth" {
  interface UserInfo extends DefaultUser {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    fullName?: fullName;
    stripeAccountId?: string;
    url: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationIds: string[];
    seenMessageIds: string[];
    subscriptions?: string;
    totalPaidOut: number;
    notifications: Notification[];
    SODT?: number;
    bio?: string;
    banner?: string;
    hasPickedRole?: boolean;
    openClosedTemplates?: any;
    role: UserRole;
    location: Location[];
  }

  interface Session {
    user: UserInfo;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phoneNumber?: string;
    name: string;
    email: string;
    fullName?: fullName;
    image?: string;
    stripeAccountId?: string;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationIds: string[];
    seenMessageIds: string[];
    subscriptions?: string;
    totalPaidOut: number;
    notifications: Notification[];
    SODT?: number;
    bio?: string;
    banner?: string;
    hasPickedRole?: boolean;
    openClosedTemplates?: any;
    role: UserRole;
  }
}
