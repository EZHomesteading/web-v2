import Link from "next/link";

const CheckoutSucess = () => {
  return (
    <div>
      <h1>Payment successful</h1>
      <p>Your payment was successful. Thank you for your order.</p>
      <p>
        <Link href="/shop">
          <a>Continue shopping</a>
        </Link>
      </p>
    </div>
  );
};

export default CheckoutSucess;
