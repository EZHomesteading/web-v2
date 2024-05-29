// server side layour for chat page
import getConversations from "@/actions/messenger/getConversations";
import ConversationList from "./components/ConversationList";
import NavbarHome from "../components/navbar/navbar-chat";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarHome user={conversations.user} />
      <ConversationList
        title="Messages"
        initialItems={conversations.conversations}
        user={conversations.user}
      />
      {children}
    </div>
  );
}
