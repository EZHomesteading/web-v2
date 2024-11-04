// server side layout for conversation open chat page
import Header from "@/app/chat/[conversationId]/components/Header";
import Body from "@/app/chat/[conversationId]/components/Body";
import EmptyState from "@/components/EmptyState";
import { redirect } from "next/navigation";
import { getFullChatData } from "@/actions/chat/getFullChatData";

interface IParams {
  conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const chatData = await getFullChatData(params.conversationId);

  if (!chatData) {
    return <EmptyState />;
  }

  const { conversation, currentUser, otherUser, order, listings, messages } =
    chatData;

  if (
    !conversation.participantIds.includes(currentUser.id) &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/chat");
  }

  const messagesWithListings = messages.map((message: any) => {
    if (message.listingId) {
      const listing = listings.find((l: any) => l.id === message.listingId);
      return { ...message, listing };
    }
    return message;
  });

  return (
    <div className="chat-layout">
      <Header name={otherUser?.name || "(Deleted User)"} />
      <Body
        initialMessages={messages}
        adminMessages={messagesWithListings}
        user={currentUser}
        otherUser={otherUser}
        order={order}
        conversationId={params.conversationId}
        listings={listings}
      />
    </div>
  );
};

export default ChatId;
