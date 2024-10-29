// types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole, Notification, fullName } from "@prisma/client";

/** Extend default User object */
declare module "next-auth" {
  interface UserInfo extends DefaultUser {
    id: string;
    phoneNumber?: string;
    fullName?: fullName
    stripeAccountId?: string;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationIds: string[];
    seenMessageIds: string[];
    subscriptions?: string;
    totalPaidOut: number;
    notifications: Notification;
    SODT?: number;
    bio?: string;
    banner?: string;
    hasPickedRole?: boolean;
    openClosedTemplates?: any;
    role: UserRole;
  }

  /** Extend default Session object */
  interface Session {
    user: User;
  }
}

/** Extend JWT interface */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phoneNumber?: string;
    fullName?: fullName
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
