//my listing page parent element
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import { currentUser } from "@/lib/auth";
import { GetListingsByUserId } from "@/actions/getListings";
import ListingsClient from "./ListingsClient";
import { getUserWithBuyOrders, getUserWithSellOrders } from "@/actions/getUser";
import { parse } from "json5";

function processOrderQuantities(orders: any) {
  const quantityMap = new Map();

  orders.forEach((order: any) => {
    try {
      const quantityData = parse(order.quantity);
      quantityData.forEach((item: any) => {
        const { id, quantity } = item;
        const currentQuantity = quantityMap.get(id) || 0;
        quantityMap.set(id, currentQuantity + quantity);
      });
    } catch (error) {
      console.error(`Error parsing quantity for order: ${order.id}`, error);
    }
  });

  const orderQuantities = Array.from(
    quantityMap,
    ([listingId, totalQuantity]) => ({
      listingId,
      totalQuantity,
    })
  );

  return orderQuantities;
}
const PropertiesPage = async () => {
  const user = await currentUser();
  if (!user) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }
  const seller = await getUserWithSellOrders({ userId: user?.id });
  const orders = seller?.sellerOrders.filter(
    (order) =>
      ![0, 4, 7, 9, 12, 15, 17, 18, 19, 20, 21, 22].includes(order.status)
  );
  console.log(orders);
  const orderQuantities = processOrderQuantities(orders);
  console.log(orderQuantities);
  const userId = user.id;
  const listings = await GetListingsByUserId({ userId });
  if (listings.listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No products found"
          subtitle="You dont have any items in your store"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingsClient
        listings={listings.listings}
        orderQuantities={orderQuantities}
        user={user}
      />
    </ClientOnly>
  );
};

export default PropertiesPage;
