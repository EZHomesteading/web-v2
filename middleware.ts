export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/my-store",
    "/dashboard",
    "/transaction-history",
    "/favorites",
    "/conversations/:path*",
    "/users/:path*",
  ],
};
