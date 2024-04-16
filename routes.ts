/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/shop",
  "/listings/[listingId]",
  "/listings",
  "/auth/become-a-producer",
  "/auth/become-a-co-op",
  "/store",
  "/how-ezh-works",
  "/privacy-policy",
  "/terms-and-conditions",
  "/who-we-are",
  "/api/webhook/stripe",
  "/api/conversations",
  "/api/messages",
  "/find-co-ops-and-producers",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/register-co-op",
  "/auth/register-producer",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const updateRoutes = ["/auth/become-a-co-op", "/auth/become-a-producer"];

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
