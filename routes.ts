/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
  "/",
  "/market",
  "/api/get/market",
  "/api/webhook/stripe",
  "/map",
  "/get-ezh-app",
  "/api/user/marker-info",
  "/api/uploadthing",
  "/api/cron",
  "/auth/reset-password",

  // "/api/baskets/active", //why does this need to be public for route to work
  // "/api/baskets/get/unique",
  // "/api/baskets/update",
];
/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/reset-password",
  "/auth/register-co-op",
  "/auth/register-producer",
  "/api/stripe/create-connected-account",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
