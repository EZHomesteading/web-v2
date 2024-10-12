import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";
import { Location, Notification, UserRole } from "@prisma/client";

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
    async signIn({ account }) {
      if (account?.provider !== "credentials") return true;
      return true;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
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
        session.user.firstName = (token.firstName as string) ?? "";
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.phoneNumber = token.phoneNumber as string | undefined;
        (session.user.location as unknown) = token.location as Location;
        session.user.image = token.image as string | undefined;
        session.user.stripeAccountId = token.stripeAccountId as
          | string
          | undefined;
        session.user.url = token.url as string;
        session.user.createdAt = token.createdAt as Date | undefined;
        session.user.updatedAt = token.updatedAt as Date | undefined;
        session.user.conversationIds = token.conversationIds as string[];
        session.user.seenMessageIds = token.seenMessageIds as string[];
        session.user.subscriptions = token.subscriptions as string | undefined;
        session.user.totalPaidOut = token.totalPaidOut as number;
        session.user.notifications = token.notifications as Notification;
        session.user.SODT = token.SODT as number | undefined;
        session.user.bio = token.bio as string | undefined;
        session.user.banner = token.banner as string | undefined;
        session.user.hasPickedRole = token.hasPickedRole as boolean | undefined
        session.user.openClosedTemplates = token.openClosedTemplates as unknown as any
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.id = existingUser.id;
      token.firstName = existingUser.firstName;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.emailVerified = existingUser.emailVerified;
      token.phoneNumber = existingUser.phoneNumber;
      token.location = existingUser.location;
      token.image = existingUser.image;
      token.hasPickedRole = existingUser.hasPickedRole
      token.url = existingUser.url;
      token.role = existingUser.role;
      token.password = existingUser.password;
      token.stripeAccountId = existingUser.stripeAccountId;
      token.createdAt = existingUser.createdAt;
      token.updatedAt = existingUser.updatedAt;
      token.conversationIds = existingUser.conversationIds;
      token.seenMessageIds = existingUser.seenMessageIds;
      token.subscriptions = existingUser.subscriptions;
      token.totalPaidOut = existingUser.totalPaidOut;
      token.notifications = existingUser.notifications;
      token.SODT = existingUser.SODT;
      token.bio = existingUser.bio;
      token.banner = existingUser.banner;
      token.openClosedTemplates = existingUser.openCloseTemplates
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 3 * 24 * 60 * 60,
  },
  ...authConfig,
});
