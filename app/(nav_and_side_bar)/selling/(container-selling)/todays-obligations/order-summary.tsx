"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import OrderCard from "./order-card";
import { PiListChecksThin } from "react-icons/pi";

const OrderSummary = ({
  user,
  orders,
  newOrders,
  pendingSetOutConfirmation,
  pendingResponse,
  pendingDelivery,
}: {
  user: any;
  orders: any[];
  newOrders: any;
  pendingSetOutConfirmation: any;
  pendingResponse: any;
  pendingDelivery: any;
}) => {
  type FilterKey = "pendingDelivery" | "newOrders" | "pendingResponse";
  const userAction = user?.role === "PRODUCER" ? "Delivery" : "Pickup";

  const [selectedFilter, setSelectedFilter] =
    useState<FilterKey>("pendingDelivery");

  const filters: { key: FilterKey; label: string }[] = [
    {
      key: "pendingDelivery",
      label: `Pending ${userAction} (${pendingDelivery.length})`,
    },
    {
      key: "pendingResponse",
      label: `Pending Your Response (${pendingResponse.length})`,
    },
    {
      key: "newOrders",
      label: `New Orders (${newOrders.length})`,
    },
  ];

  const emptyStateMessages = {
    pendingDelivery: `You do not have any orders pending ${userAction.toLowerCase()}.`,
    newOrders: `You do not have new orders.`,
    pendingResponse: "You do not have any orders waiting for your response.",
  };

  const filteredOrders = orders.filter((order: any) => {
    switch (selectedFilter) {
      case "pendingDelivery":
        return order.status === 10 || order.status === 13;
      case "newOrders":
        return order.status === 1;
      case "pendingResponse":
        return order.status === 6;
      default:
        return true;
    }
  });

  return (
    <>
      <div className="flex gap-x-1 pb-3 overflow-x-auto flex-nowrap hide-scrollbar">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            className={`rounded-full bg-inherit ${
              selectedFilter === filter.key ? "bg-gray-200" : ""
            }`}
            variant="outline"
            onClick={() => setSelectedFilter(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="bg-[#d8e2c6] flex gap-x-3 rounded-xl h-64 mt-2 p-3 overflow-x-auto">
          {filteredOrders.map((order: any) => (
            <OrderCard key={order.id} order={order} user={user} />
          ))}
        </div>
      ) : (
        <div className="bg-[#d8e2c6] flex flex-col items-center justify-center rounded-xl h-64 mt-2">
          <PiListChecksThin
            className="h-12 w-12 text-gray-500 mb-2"
            aria-hidden="true"
          />
          <p className="text-gray-700 text-center px-4">
            {emptyStateMessages[selectedFilter]}
          </p>
        </div>
      )}
    </>
  );
};

export default OrderSummary;
