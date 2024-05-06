import getConversations from "../../../actions/messenger/getConversations";
import getUsers from "../../../actions/user/getUsers";

import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <div className="h-full">
      <ConversationList
        users={users}
        title="Messages"
        initialItems={conversations}
      />
      {children}
    </div>
  );
}
