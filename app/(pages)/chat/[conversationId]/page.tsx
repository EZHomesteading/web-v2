import getConversationById from "@/actions/messenger/getConversationById";
import getMessages from "@/actions/messenger/getMessages";

import Header from "./components/Header";
import Body from "./components/Body";
import EmptyState from "@/app/components/EmptyState";
import { currentUser } from "@/lib/auth";
import Form from "./components/Form";
import GetOrderByConvoId from "@/actions/messenger/getOrderByConvoId";
import getUserRoleById from "@/actions/messenger/getUserRoleById";

interface IParams {
  conversationId: string;
  userIds: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const user = await currentUser();
  const order = await GetOrderByConvoId(params.conversationId);
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const userIds = conversation?.userIds;
  const otherUsers = userIds?.filter((userId) => userId !== user?.id);
  const otherUser: any = otherUsers?.toString();
  const userId = otherUser;
  const otherUserRole = await getUserRoleById({ userId });

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
        <Body
          initialMessages={messages}
          otherUser={otherUser}
          order={order}
          otherUserRole={otherUserRole}
        />
        {/* <Form otherUsersId={otherUser} /> */}
      </div>
    </div>
  );
};

export default ChatId;
