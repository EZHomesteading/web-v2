const paymentIntentId = "PAYMENT_INTENT_ID";
const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
  paymentIntentId
);

const frankVendorAmount = parseInt(
  retrievedPaymentIntent.metadata.frankVendorAmount
);
const jimVendorAmount = parseInt(
  retrievedPaymentIntent.metadata.jimVendorAmount
);

const transfer1 = await stripe.transfers.create({
  amount: frankVendorAmount,
  currency: "usd",
  destination: "FRANK_VENDOR_ACCOUNT_ID",
  transfer_group: parentOrderId,
});

const transfer2 = await stripe.transfers.create({
  amount: jimVendorAmount,
  currency: "usd",
  destination: "JIM_VENDOR_ACCOUNT_ID",
  transfer_group: parentOrderId,
});
