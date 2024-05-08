import getConversations from "@/actions/messenger/getConversations";
import getUsers from "@/actions/user/getUsers";

import ConversationList from "./components/ConversationList";
import Navbar from "../components/navbar/Navbar";
import NavbarHome from "../components/navbar/navbar-chat";
import { currentUser } from "@/lib/auth";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  const user = await currentUser();
  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarHome user={user} />
      <ConversationList
        users={users}
        title="Messages"
        initialItems={conversations}
      />
      {children}
    </div>
  );
}
