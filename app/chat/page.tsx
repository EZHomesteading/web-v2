"use client";
// base server component for chat page
import clsx from "clsx";
import useConversation from "@/hooks/messenger/useConversation";
import EmptyState from "@/app/components/EmptyState";
import MessagesPopup from "@/app/(home)/info-modals/messages-info-modal";

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx(" lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
      <MessagesPopup />
    </div>
  );
};

export default Home;
