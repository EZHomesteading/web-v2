"use server";
//auth action for logging users out
import { signOut } from "@/auth";

export const logout = async () => {
  await signOut();
};
