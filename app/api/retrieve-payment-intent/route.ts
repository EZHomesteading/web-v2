import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);

const paymentIntent = await stripe.paymentIntents.retrieve(
  "pi_3MtwBwLkdIwHu7ix28a3tqPa"
);
