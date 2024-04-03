import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  // updateRoutes,
} from "@/routes";
import { UserRole } from "@prisma/client";
const { auth } = NextAuth(authConfig);
// import { currentUser } from "./lib/auth";
export default auth(async (req) => {
  const { nextUrl } = req;
  // const user = await currentUser();
  const path = nextUrl.pathname;
  const firstIndex = path.indexOf("/");
  const index = path.indexOf("/", firstIndex + 1); // Find the index of the first "/"
  const filteredString = index !== -1 ? path.substring(0, index) : path;

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutes.includes(filteredString);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  // const isUpdateRoute = updateRoutes.includes(nextUrl.pathname);

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

  if (!isLoggedIn && !isPublicRoute) {
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
