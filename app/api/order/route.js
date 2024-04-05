export async function POST(request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { orders } = body;

  const createdOrders = [];

  for (const order of orders) {
    const {
      userId,
      listingId,
      pickupDate,
      quantity,
      totalPrice,
      status,
      stripePaymentIntentId,
      conversationId,
      payments,
    } = order;

    const requiredFields = [
      "userId",
      "listingId",
      "pickupDate",
      "quantity",
      "totalPrice",
      "status",
    ];
    if (requiredFields.some((field) => !order[field])) {
      return NextResponse.error();
    }

    const listing = await getListingById(listingId);
    if (!listing) {
      return NextResponse.error();
    }

    const createdOrder = await prisma.order.create({
      data: {
        userId,
        listingId,
        pickupDate,
        quantity,
        totalPrice: listing.price * quantity,
        status,
        stripePaymentIntentId,
        stripeSessionId: "",
        seller: {
          connect: { id: listing.userId },
        },
        fee: totalPrice * 0.06,
        conversationId,
        payments: {
          create: payments,
        },
      },
    });

    createdOrders.push(createdOrder);
  }

  return NextResponse.json(createdOrders);
}
