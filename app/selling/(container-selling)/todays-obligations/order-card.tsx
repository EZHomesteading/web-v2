const OrderCard = ({ order, user }: { order: any; user: any }) => {
  const actions = [];

  if (order.status === "Pending Delivery" && user.role === "PRODUCER") {
    actions.push(
      <button key="mark-delivered" onClick={() => markAsDelivered(order.id)}>
        Mark as Delivered
      </button>
    );
  }

  return (
    <div className="card mb-4 p-4 border rounded">
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      {/* Display other relevant order details */}
      <div className="actions mt-2">{actions}</div>
    </div>
  );
};

export default OrderCard;

const markAsDelivered = async (orderId: string) => {};
