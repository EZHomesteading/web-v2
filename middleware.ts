import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  // coopRoutes,
} from "@/routes";
import { UserRole } from "@prisma/client";
import { currentUser } from "./lib/auth";
const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const user = await currentUser();
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const firstIndex = path.indexOf("/");
  const index = path.indexOf("/", firstIndex + 1); // Find the index of the first "/"
  const filteredString = index !== -1 ? path.substring(0, index) : path;

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutes.includes(filteredString) ||
    nextUrl.pathname.startsWith("/info/");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  // const isCoopRoute = coopRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null as unknown as void;
  }

  if (isApiAuthRoute) {
    return null as unknown as void;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null as unknown as void;
  }

  // if (isCoopRoute && user?.role !== UserRole.COOP) {
  //   let callbackUrl = nextUrl.pathname;
  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search;
  //   }
  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);
  //   return Response.redirect(
  //     new URL(`/shop?callbackUrl=${encodedCallbackUrl}`, nextUrl)
  //   );
  // }

  if (!isLoggedIn && !isPublicRoute) {
    // if (!isLoggedIn && isUpdateRoute) {
    //   let callbackUrl = nextUrl.pathname;
    //   if (nextUrl.search) {
    //     callbackUrl += nextUrl.search;
    //   }
    //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    //   const redirectUrl = updateRoutes.includes(callbackUrl)
    //     ? DEFAULT_LOGIN_REDIRECT
    //     : `/auth/become-a-co-op?callbackUrl=${encodedCallbackUrl}`;
    //   return Response.redirect(new URL(redirectUrl, nextUrl));
    // }

    // if (user?.role === "CONSUMER" && isUpdateRoute) {
    //   let callbackUrl = nextUrl.pathname;
    //   if (nextUrl.search) {
    //     callbackUrl += nextUrl.search;
    //   }
    //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    //   const redirectUrl = updateRoutes.includes(callbackUrl)
    //     ? DEFAULT_LOGIN_REDIRECT
    //     : `/auth/become-a-co-op?callbackUrl=${encodedCallbackUrl}`;
    //   return Response.redirect(new URL(redirectUrl, nextUrl));
    // }

    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null as unknown as void;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/my-store",
    "/dashboard",
    "/transaction-history",
    "/favorites",
    "/conversations/:path*",
    "/users/:path*",
  ],
};
