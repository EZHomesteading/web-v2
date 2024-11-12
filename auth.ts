import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"
import { fullName, Notification, UserRole } from "@prisma/client"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== "credentials") return true
      return true
    },
    
    async session({ token, session }: { token: JWT; session: Session }) {
      if (session.user) {
        // Basic user info
        session.user.id = token.sub ?? token.id as string
        session.user.name = token.name
        session.user.email = token.email ?? ""

        // Extended user info
        session.user.fullName = token.fullName as fullName
        session.user.phoneNumber = token.phoneNumber as string | undefined
        session.user.image = token.image as string | undefined
        session.user.stripeAccountId = token.stripeAccountId as string | undefined
        session.user.url = token.url as string
        session.user.role = token.role as UserRole

        // Timestamps and metadata
        session.user.createdAt = token.createdAt as Date | undefined
        session.user.updatedAt = token.updatedAt as Date | undefined
        session.user.hasPickedRole = token.hasPickedRole as boolean | undefined

        // Business logic
        session.user.subscriptions = token.subscriptions as string | undefined
        session.user.totalPaidOut = token.totalPaidOut as number
        session.user.notifications = token.notifications as Notification[]
        session.user.openClosedTemplates = token.openClosedTemplates as any
        session.user.canRecievePayouts = token.canRecievePayouts as boolean
      }
      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      return {
        ...token,
        id: existingUser.id,
        fullName: existingUser.fullName ?? { first: null, last: null },
        name: existingUser.name,
        email: existingUser.email,
        emailVerified: existingUser.emailVerified,
        phoneNumber: existingUser.phoneNumber ?? undefined,
        image: existingUser.image ?? undefined,
        hasPickedRole: existingUser.hasPickedRole ?? false,
        url: existingUser.url ?? "",
        role: existingUser.role,
        password: existingUser.password,
        stripeAccountId: existingUser.stripeAccountId ?? undefined,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
        subscriptions: existingUser.subscriptions ?? undefined,
        totalPaidOut: existingUser.totalPaidOut ?? 0,
        notifications: existingUser.notifications,
        openClosedTemplates: existingUser.openCloseTemplates,
        canRecievePayouts: existingUser.canRecievePayouts ?? undefined
      }
    },
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  ...authConfig,
})