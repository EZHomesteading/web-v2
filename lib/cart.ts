"use server";

import { Get } from "@/actions/getCart";

export async function addToBasket(prevState: unknown, formData: FormData) {
  const prevCart = await Get(
    "/get-many?collection=BasketItem&value=${user?.id}&key=userId&fields=listingId"
  );
  const listingId = formData.get("listingId");
  if (typeof listingId !== "string") {
    return;
  }
  const itemAlreadyExists = prevCart.find((item) => item.id === listingId);
  if (itemAlreadyExists) {
    const newCart = prevCart.map((item) => {
      if (item.listingId === listingId) {
        return {
          ...item,
        };
      }
      return item;
    });
    await updateCart(newCart);
  } else {
    const newCart = [
      ...prevCart,
      {
        listingId,
        quantity: 1,
      },
    ];
    await updateCart(newCart);
  }

  return "Item added to cart";
}

export async function removeFromCart(formData: FormData) {
  const prevCart = await getCart();
  const listingId = formData.get("listingId");
  if (typeof listingId !== "string") {
    return;
  }
  const itemAlreadyExists = prevCart.find(
    (item) => item.listingId === listingId
  );
  if (!itemAlreadyExists) {
    return;
  }
  const newCart = prevCart.filter((item) => item.listingId !== listingId);
  await updateCart(newCart);
}
