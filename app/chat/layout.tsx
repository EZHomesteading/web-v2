// server side layour for chat page
import ConversationList from "./components/ConversationList";
import { getConversations } from "@/actions/chat/getChat";
import { getNavUser, NavUser } from "@/actions/getUser";
import Navbar from "@/components/navbar/navbar.server";
import { FullConversationType } from "@/types";

import type { Viewport } from "next";

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
      <Navbar user={navUser as unknown as NavUser} />

      <div className={`sm:pt-16 md:pt-32`}>
        {/* pt subject to change */}
        <ConversationList
          title="Messages"
          initialItems={
            conversations.conversations as unknown as FullConversationType[]
          }
          user={conversations.user}
        />
        {children}
      </div>
    </div>
  );
}
