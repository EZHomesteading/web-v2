"use client";
// base server component for chat page
import clsx from "clsx";
import useConversation from "@/hooks/messenger/useConversation";
import EmptyState from "@/app/components/EmptyState";
import MessagesPopup from "@/app/(home)/info-modals/messages-info-modal";

import axios from "axios";

const Home = () => {
  const { isOpen } = useConversation();
  axios.post("/api/chat/checkTimeComplete");
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
