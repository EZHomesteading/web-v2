import { auth } from "@/auth";
import { authenticatedFetch } from "@/lib/api-utils";
import { Basket_ID_Page } from "basket";
import { headers } from "next/headers";

export default async function getUnique({ id }: { id: string }): Promise<{
  basket: Basket_ID_Page | null;
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log("No session available in getActiveBaskets");
      return { basket: null };
    }

    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const url = new URL(`/api/baskets/get/unique`, `${protocol}://${host}`);
    url.searchParams.set("id", id);
    url.searchParams.set("userId", session.user.id);

    const response = await authenticatedFetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch basket: ${response.status}`);
    }

    const data = await response.json();
    return {
      basket: data || null,
    };
  } catch (error) {
    console.error("[GET_UNIQUE]", error);
    return {
      basket: null,
    };
  }
}
