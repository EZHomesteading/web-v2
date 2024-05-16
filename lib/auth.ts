import { auth } from "@/auth";
import authCache from "@/auth-cache";
import { useCurrentUser } from "@/hooks/user/use-current-user";
export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
