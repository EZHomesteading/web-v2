// server side layout for conversation open chat page
import { getConversationById } from "@/actions/chat/getChat";
import { getMessages } from "@/actions/chat/getChat";
import Header from "@/app/chat/[conversationId]/components/Header";
import Body from "@/app/chat/[conversationId]/components/Body";
import EmptyState from "@/app/components/EmptyState";
import { GetOrderByConvoId } from "@/actions/getOrder";
import { FullConversationType } from "@/types";
import { Order } from "@prisma/client";
import { UserInfo } from "@/next-auth";

interface IParams {
  conversationId: string;
  userIds: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const conversationData = await getConversationById(params.conversationId);

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
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        {conversationData && (
          <>
            <Header
              conversation={conversation as unknown as FullConversationType}
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
