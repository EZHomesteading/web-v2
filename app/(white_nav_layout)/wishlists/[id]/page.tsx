import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import WishlistClient from "./components/wishlist.client";

interface p {
  params: { id: string };
}

const WishlistPage = async ({ params }: p) => {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    const wishlist = await getWishlist(params.id);
    const seller = { name: wishlist.location.displayName };
    return (
      <div>
        <h1>{seller}</h1>
        <WishlistClient wishlist={wishlist} id={params.id} />
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error instanceof Error ? error.message : "Something went wrong"}</p>
      </div>
    );
  }
};

export default WishlistPage;

async function getWishlist(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/wishlists/${id}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Wishlist not found");
    }
    if (res.status === 401) {
      redirect("/auth/login");
    }
    throw new Error("Failed to fetch wishlist");
  }

  return res.json();
}
