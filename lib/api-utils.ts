import { cookies } from "next/headers";
import { auth } from "@/auth";

// Helper function to make authenticated API calls
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  const cookieStore = cookies();
  const session = await auth();

  if (!session?.user) {
    throw new Error("No session available");
  }

  // Get all cookies as a string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Merge default options with provided options
  const mergedOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Cookie: cookieHeader,
    },
  };

  return fetch(url, mergedOptions);
}
