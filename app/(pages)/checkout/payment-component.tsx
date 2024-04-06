// import React, { useState } from "react";
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// interface CheckoutFormProps {
//   cartItems: any;
// }

// export default function CheckoutForm({ cartItems }: CheckoutFormProps) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [message, setMessage] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [orderDetails, setOrderDetails] = React.useState(null);

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }
//     setIsLoading(true);

//     const orderAmounts = cartItems.reduce((acc: any, cartItem: any) => {
//       const coopId = cartItem.listing.userId;
//       if (!acc[coopId]) {
//         acc[coopId] = 0;
//       }
//       acc[coopId] += cartItem.listing.price * cartItem.quantity;
//       return acc;
//     }, {});

//     const response = await fetch("/api/create-payment-intent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ orderAmounts: Object.values(orderAmounts) }),
//     });

//     const { clientSecrets } = await response.json();

//     const paymentIntentResults = await Promise.all(
//       clientSecrets.map((clientSecret: string) =>
//         stripe.confirmPayment({
//           elements,
//           clientSecret,
//           confirmParams: {
//             return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
//           },
//         })
//       )
//     );

//     const successfulPayments = paymentIntentResults.filter(
//       (result) => result.paymentIntent?.status === "succeeded"
//     );

//     if (successfulPayments.length === clientSecrets.length) {
//       const orderDetails = cartItems.map((cartItem: any) => ({
//         userId: cartItem.userId,
//         listingId: cartItem.listingId,
//         pickupDate: cartItem.pickupDate,
//         quantity: cartItem.quantity,
//         totalPrice: cartItem.listing.price * cartItem.quantity,
//         status: "pending",
//         stripePaymentIntentId: successfulPayments.find(
//           (payment) =>
//             payment.paymentIntent?.amount ===
//             orderAmounts[cartItem.listing.userId]
//         )?.paymentIntent?.id,
//         conversationId: "",
//         payments: [
//           {
//             stripePaymentIntentId: successfulPayments.find(
//               (payment) =>
//                 payment.paymentIntent?.amount ===
//                 orderAmounts[cartItem.listing.userId]
//             )?.paymentIntent?.id,
//             amount: cartItem.listing.price * cartItem.quantity,
//             status: "succeeded",
//           },
//         ],
//       }));

//       setOrderDetails(orderDetails);

//       const createOrderResponse = await fetch("/api/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ orders: orderDetails }),
//       });

//       if (createOrderResponse.ok) {
//         setMessage("Your payment was successful.");
//       } else {
//         setMessage("Failed to create order. Please try again.");
//       }
//     } else {
//       setMessage("Payment failed. Please try again.");
//     }

//     setIsLoading(false);
//   };

//   const paymentElementOptions = {
//     layout: "tabs",
//   };

//   return (
//     <>
//       <form id="payment-form" onSubmit={handleSubmit}>
//         <PaymentElement id="payment-element" />
//         <button
//           className="border-black border-[1px] rounded-md p-2 w-full hover:text-green-900"
//           disabled={isLoading || !stripe || !elements}
//           id="submit"
//         >
//           Pay Now
//         </button>
//         {message && <div id="payment-message">{message}</div>}
//       </form>
//     </>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface PaymentComponentProps {
  cartItems: any;
}
export default function PaymentComponent({ cartItems }: PaymentComponentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Your payment was successful.");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements: elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage("error card");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button
          className="border-black border-[1px] rounded-md p-2 w-full hover:text-green-900 mt-2"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          Pay Now
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
