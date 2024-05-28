import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  reAuthRoutes,
} from "@/routes";
const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const firstIndex = path.indexOf("/");
  const index = path.indexOf("/", firstIndex + 1);
  const filteredString = index !== -1 ? path.substring(0, index) : path;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutes.includes(filteredString) ||
    nextUrl.pathname.startsWith("/info/") ||
    nextUrl.pathname.startsWith("/profile/");
  const isReAuthRoute = reAuthRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

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
  if (!isLoggedIn && isReAuthRoute) {
    return Response.redirect(new URL(`/auth/login`, nextUrl));
  }
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
