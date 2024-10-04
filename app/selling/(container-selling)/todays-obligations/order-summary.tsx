"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import OrderCard from "./order-card";
import { PiListChecksThin } from "react-icons/pi";

const OrderSummary = ({ user, orders }: { user: any; orders: any }) => {
  type FilterKey =
    | "pendingDelivery"
    | "pendingConfirmation"
    | "pendingResponse";
  const userAction = user?.role === "PRODUCER" ? "Delivery" : "Pickup";

  const [selectedFilter, setSelectedFilter] =
    useState<FilterKey>("pendingDelivery");

  const filters: { key: FilterKey; label: string }[] = [
    {
      key: "pendingDelivery",
      label: `Pending ${userAction} (${orders.length})`,
    },
    {
      key: "pendingConfirmation",
      label: `Pending ${userAction} Confirmation (${orders.length})`,
    },
    {
      key: "pendingResponse",
      label: `Pending Your Response (${orders.length})`,
    },
  ];

  const emptyStateMessages = {
    pendingDelivery: `You do not have any orders pending ${userAction.toLowerCase()}.`,
    pendingConfirmation: `You do not have any orders pending ${userAction.toLowerCase()} confirmation.`,
    pendingResponse: "You do not have any orders waiting for your response.",
  };

  const filteredOrders = orders.filter((order: any) => {
    switch (selectedFilter) {
      case "pendingDelivery":
        return order.status === "Pending Delivery";
      case "pendingConfirmation":
        return order.status === "Pending Confirmation";
      case "pendingResponse":
        return order.status === "Pending Response";
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
        <div className="bg-[#d8e2c6] rounded-xl h-64 mt-2">
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
