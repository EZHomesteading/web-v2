import { Wishlist } from "@/app/(white_nav_layout)/wishlists/page";
import authCache from "@/auth-cache";
import { NextResponse } from "next/server";
import { Wishlist_ID_Page } from "wishlist";

async function getActiveWishlists(): Promise<{
  wishlists: Wishlist[];
}> {
  const session = await authCache();
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/wishlists/active?userId=${session?.user?.id}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Wishlist not found");
      }

      throw new Error("Failed to fetch wishlist");
    }
    const data = await response.json();
    return {
      wishlists: data || [],
    };
  } catch {
    return {
      wishlists: [],
    };
  }
}

async function getUniqueWishList({ id }: { id: string }): Promise<{
  wishlist?: Wishlist_ID_Page;
}> {
  const session = await authCache();
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/wishlists/get/unique?id=${id}&userId=${session?.user?.id}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Wishlist not found");
      }

      throw new Error("Failed to fetch wishlist");
    }
    const data = await response.json();
    return {
      wishlist: data,
    };
  } catch (error) {
    return { wishlist: undefined };
  }
}
export { getActiveWishlists, getUniqueWishList };
