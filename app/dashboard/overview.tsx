"use client";
//overview of recent transactions graph
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Order } from "@prisma/client";

interface OverviewProps {
  sellerOrders: Order[];
}

export default function Overview({ sellerOrders }: OverviewProps) {
  const filteredOrders = sellerOrders.filter((order) => {
    const { status } = order;
    return status === 9 || (status >= 16 && status <= 19);
  });

  const monthlyData = filteredOrders.reduce((acc, order) => {
    const month = new Date(order.updatedAt).getMonth();
    acc[month] = (acc[month] || 0) + order.totalPrice;
    return acc;
  }, Array(12).fill(0) as number[]);

  const data = monthlyData.map((totalPrice, month) => ({
    month: new Date(0, month).toLocaleString("default", { month: "short" }),
    totalPrice: totalPrice * 10,
  }));

  return (
    <div className="mt-3 h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Bar
            dataKey="totalPrice"
            style={
              {
                fill: "black",
                opacity: 0.9,
              } as React.CSSProperties
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
