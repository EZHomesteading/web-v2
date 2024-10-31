// server side layour for chat page
import ConversationList from "./components/ConversationList";
import Navbar from "../../components/navbar/Navbar";
import { getConversations } from "@/actions/chat/getChat";
import type { Viewport } from "next";
import { getNavUser, NavUser } from "@/actions/getUser";
import { UserInfo } from "next-auth";

export const viewport: Viewport = {
  themeColor: "rgb(	241 239 231)",
};
export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const navUser = await getNavUser();
  return (
    <div className="min-h-screen bg-chat">
      <Navbar user={navUser as unknown as NavUser} isChat={true} />

      <ConversationList
        title="Messages"
        initialItems={conversations.conversations}
        user={conversations.user as unknown as UserInfo}
      />
      {children}
    </div>
  );
}
