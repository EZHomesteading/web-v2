"use client";

import clsx from "clsx";
import useConversation from "@/hooks/messenger/useConversation";
import EmptyState from "@/components/EmptyState";
import MessagesPopup from "@/app/(white_nav_layout)/info-modals/messages-info-modal";
import { useEffect, useRef } from "react";
import axios from "axios";

const Home = () => {
  const { isOpen } = useConversation();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) {
      return; // Skip if the effect has already run
    }

    const timer = setTimeout(() => {
      axios
        .post("/api/chat/checkTimeComplete")
        .catch((error) => {
          console.error("Error calling API:", error);
        })
        .finally(() => {
          effectRan.current = true;
        });
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
