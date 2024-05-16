import getConversationById from "@/actions/messenger/getConversationById";
import getMessages from "@/actions/messenger/getMessages";

import Header from "@/app/chat/[conversationId]/components/Header";
import Body from "@/app/chat/[conversationId]/components/Body";
import EmptyState from "@/app/components/EmptyState";
import GetOrderByConvoId from "@/actions/messenger/getOrderByConvoId";

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
        <Header conversation={conversation} />
        <Body
          initialMessages={messages}
          user={currentUser}
          order={order}
          otherUser={otherUser}
          conversationId={conversationData.id}
        />
      </div>
    </div>
  );
};

export default ChatId;
