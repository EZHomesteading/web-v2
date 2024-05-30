//payment intent API
import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/actions/getOrder";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const { totalSum, userId, orderTotals, body, email, orderIds } =
    await request.json();
  console.log("totalSum: ", totalSum);
  console.log(orderIds);

  try {
    if (orderIds === null) {
      console.error("Error creating PaymentIntent:");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
    const b = orderIds.replace(/,(?=[^,]*$)/, "");
    const orderIdsArray = JSON.parse(b);
    orderIdsArray.map(async (orderId: string) => {
      const order = await getOrderById({ orderId });
      console.log(order?.pickupDate);
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalSum,
      currency: "usd",
      statement_descriptor_suffix: "EZHomesteading",
      description: JSON.stringify(body),
      metadata: {
        userId,
        orderTotals: JSON.stringify(orderTotals),
        orderIds,
      },
      receipt_email: email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
