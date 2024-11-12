import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const path = nextUrl.pathname;
  const firstIndex = path.indexOf("/");
  const index = path.indexOf("/", firstIndex + 1);
  const filteredString = index !== -1 ? path.substring(0, index) : path;
  // Check route types
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutes.includes(filteredString) ||
    nextUrl.pathname.startsWith("/info/") ||
    nextUrl.pathname.startsWith("/profile/") ||
    nextUrl.pathname.startsWith("/store/") ||
    nextUrl.pathname.startsWith("/listings/") ||
    nextUrl.pathname.startsWith("/api/cron");
  const isAuthRoute = authRoutes.includes(path);

  // Allow all API routes to pass through - we'll protect them individually
  if (path.startsWith("/api/")) {
    return;
  }

  // Handle auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Public routes
  if (isPublicRoute) {
    return;
  }

  // Protected routes
  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
