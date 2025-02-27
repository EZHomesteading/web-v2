import { auth } from "@/auth";

export const goFetchMiddleware = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const session = await auth();
  if (!session?.user?.goToken) {
    throw new Error("No authentication token available");
  }

  return fetch(`${process.env.API_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.user.goToken}`,
      "Content-Type": "application/json",
    },
  });
};
