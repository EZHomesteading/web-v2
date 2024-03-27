import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";

import Header from "./components/Header";
import Body from "./components/Body";
import EmptyState from "@/app/components/EmptyState";
import { currentUser } from "@/lib/auth";

interface IParams {
  conversationId: string;
  userIds: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const user = await currentUser();
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const userIds = conversation?.userIds;
  const otherUsers = userIds?.filter((userId) => userId !== user?.id);
  const otherUser = otherUsers?.toString();

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} otherUser={otherUser} />
        {/* <Form /> */}
      </div>
    </div>
  );
};

export default ChatId;
