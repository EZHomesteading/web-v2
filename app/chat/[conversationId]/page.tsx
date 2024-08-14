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
  const order = await GetOrderByConvoId(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const { currentUser, otherUser, ...conversation } = conversationData;
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
      <div className="lg:pl-80 min-h-[110vh]">
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
    <div className="lg:pl-80 min-h-[110vh]">
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
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatId;
