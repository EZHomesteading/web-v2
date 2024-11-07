import { Basket } from "@/app/(white_nav_layout)/my-baskets/page";
import authCache from "@/auth-cache";
import { Basket_ID_Page } from "@/types/basket";

async function getActiveBaskets(): Promise<{
  baskets: Basket[];
}> {
  const session = await authCache();
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/baskets/active?userId=${session?.user?.id}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Basket not found");
      }

      throw new Error("Failed to fetch basket");
    }
    const data = await response.json();
    return {
      baskets: data || [],
    };
  } catch {
    return {
      baskets: [],
    };
  }
}

async function getUniqueBasket({ id }: { id: string }): Promise<{
  basket?: Basket_ID_Page;
}> {
  const session = await authCache();
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/baskets/get/unique?id=${id}&userId=${session?.user?.id}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Basket not found");
      }

      throw new Error("Failed to fetch basket");
    }
    const data = await response.json();
    return {
      basket: data,
    };
  } catch (error) {
    return { basket: undefined };
  }
}
export { getActiveBaskets, getUniqueBasket };
