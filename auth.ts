import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";
import { Hours, Location, UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.phoneNumber = token.phoneNumber as string | undefined;
        session.user.location = token.location as Location;
        session.user.image = token.image as string | undefined;
        session.user.hours = token.hours as Hours;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.stripeAccountId = token.stripeAccountId as
          | string
          | undefined;
        session.user.createdAt = token.createdAt as Date | undefined;
        session.user.updatedAt = token.updatedAt as Date | undefined;
        session.user.conversationIds = token.conversationIds as string[];
        session.user.seenMessageIds = token.seenMessageIds as string[];
        session.user.favoriteIds = token.favoriteIds as string[];
        session.user.subscriptions = token.subscriptions as string | undefined;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.id = existingUser.id;
      token.isOAuth = !!existingAccount;
      token.firstName = existingUser.firstName;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.emailVerified = existingUser.emailVerified;
      token.phoneNumber = existingUser.phoneNumber;
      token.location = existingUser.location;
      token.image = existingUser.image;
      token.hours = existingUser.hours;
      token.role = existingUser.role;
      token.password = existingUser.password;
      token.stripeAccountId = existingUser.stripeAccountId;
      token.createdAt = existingUser.createdAt;
      token.updatedAt = existingUser.updatedAt;
      token.conversationIds = existingUser.conversationIds;
      token.seenMessageIds = existingUser.seenMessageIds;
      token.favoriteIds = existingUser.favoriteIds;
      token.subscriptions = existingUser.subscriptions;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
