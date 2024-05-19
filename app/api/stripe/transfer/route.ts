import getOrderByIdTransfer from "@/actions/getOrderByIdTransfer";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { orderId, stripeAccountId, total } = req.body;

  try {
    const order = await getOrderByIdTransfer(orderId);

    if (!order) {
      res.status(400).json({ error: "Invalid order details" });
      return;
    }

    // this checks the order details against the order being passed in the api route, if they differ, the transfer will not succeeed. this basically means if someone were to inject js into the browser, they would need to know the order total and stripe account id of the seller, and they wouldn't being paying themselves out. And if the stripe account id was their own, they would have to provide their sensitive data such as last 4 ssn in order to get the money paid out
    if (
      order.seller.stripeAccountId !== stripeAccountId ||
      order.totalPrice !== total
    ) {
      res.status(400).json({ error: "Nice try" });
      return;
    }

    const transfer = await stripe.transfers.create({
      amount: total,
      currency: "usd",
      destination: stripeAccountId,
      description: "EZH Transfer",
    });

    res
      .status(200)
      .json({ message: "Transfer initiated successfully", transfer });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ error: "Failed to initiate transfer" });
  }
}
