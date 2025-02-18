// app/api/stripe/get-or-create-customer/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, existingCustomerId } = body;

    let customerId = existingCustomerId;

    if (!customerId) {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        // Use existing customer if found
        customerId = customers.data[0].id;
      } else {
        // Create new customer if none exists
        const newCustomer = await stripe.customers.create({
          email,
        });
        customerId = newCustomer.id;
      }
    }

    return NextResponse.json({ customerId });
  } catch (error: any) {
    console.error("Error with customer:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
