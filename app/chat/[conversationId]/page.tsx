// server side layout for conversation open chat page
import { getConversationById } from "@/actions/chat/getChat";
import { getMessages } from "@/actions/chat/getChat";
import Header from "@/app/chat/[conversationId]/components/Header";
import Body from "@/app/chat/[conversationId]/components/Body";
import EmptyState from "@/app/components/EmptyState";
import { GetOrderByConvoId } from "@/actions/getOrder";
import { FullConversationType } from "@/types";
import { Order, Reviews, User } from "@prisma/client";
import { UserInfo } from "@/next-auth";
import { getUserWithBuyReviews } from "@/actions/getUser";
import { redirect } from "next/navigation";
import { getListingsByIdsChat } from "@/actions/getListings";

interface IParams {
  conversationId: string;
  userIds: string;
}
interface ReviewWithReviewer extends Reviews {
  reviewer: User | null;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const conversationData = await getConversationById(params.conversationId);
  const data = await getUserWithBuyReviews({
    userId: conversationData?.otherUser?.id,
  });

  if (!conversationData) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  let order = await GetOrderByConvoId(params.conversationId);
  if (!order) {
    order = {
      id: "66d764318fd299484b5c914b",
      userId: "66d764318fd299484b5c914b",
      listingIds: ["66d764318fd299484b5c914b"],
      sellerId: "66d764318fd299484b5c914b",
      pickupDate: new Date(),
      paymentIntentId: null,
      quantity: "0",
      totalPrice: 0,
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
      fee: 0,
      conversationId: null,
      location: {
        type: "point",
        coordinates: [0, 0],
        address: ["string[]"],
        hours: { 0: [{ open: 480, close: 900 }] },
      },
    };
  }
  const messages = await getMessages(params.conversationId);
  const { currentUser, otherUser, ...conversation } = conversationData;
  const listings = order?.listingIds
    ? await getListingsByIdsChat(order.listingIds)
    : [];
  if (
    currentUser.id === conversationData.userIds[1] ||
    currentUser.id === conversationData.userIds[0]
  ) {
  } else {
    if (currentUser.role !== "ADMIN") {
      redirect("/chat");
    }
  }
  if (!data) {
    const reviewsFinal: Reviews[] = [
      {
        id: "null",
        reviewerId: "null",
        reviewedId: "null",
        buyer: false,
        review: "null",
        rating: 0,
      },
    ];
    return (
      <div className="lg:pl-80 min-h-[100vh]">
        <div className="h-full flex flex-col">
          {conversationData && (
            <>
              <Header
                conversation={conversation as unknown as FullConversationType}
                order={order as unknown as Order}
                reviews={reviewsFinal}
              />
              <Body
                initialMessages={messages}
                user={currentUser as unknown as UserInfo}
                order={order as unknown as Order}
                otherUser={otherUser}
                conversationId={conversationData.id}
                listings={listings}
                reviews={reviewsFinal}
              />
            </>
          )}
        </div>
      </div>
    );
  }
  const { reviews } = data;
  const reviewsFinal: Reviews[] = await Promise.all(
    reviews.map(async (review) => {
      return { ...review };
    })
  );
  return (
    <div className="lg:pl-80 min-h-[100vh]">
      <div className="h-full flex flex-col">
        {conversationData && (
          <>
            <Header
              conversation={conversation as unknown as FullConversationType}
              order={order as unknown as Order}
              reviews={reviewsFinal}
            />
            <Body
              initialMessages={messages}
              user={currentUser as unknown as UserInfo}
              order={order as unknown as Order}
              otherUser={otherUser}
              conversationId={conversationData.id}
              listings={listings}
              reviews={reviewsFinal}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatId;
