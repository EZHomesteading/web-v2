// server side layour for chat page
import ConversationList from "./components/ConversationList";
import NavbarHome from "../components/navbar/navbar-chat";
import { getConversations } from "@/actions/chat/getChat";
import type { Viewport } from "next";
import { UserInfo, navUser } from "@/next-auth";

export const viewport: Viewport = {
  themeColor: "rgb(	241 239 231)",
};
export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <div className="min-h-screen bg-chat">
      <NavbarHome user={conversations.user as unknown as navUser} />
      <ConversationList
        title="Messages"
        initialItems={conversations.conversations}
        user={conversations.user as unknown as UserInfo}
      />
      {children}
    </div>
  );
}
