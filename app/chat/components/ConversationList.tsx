"use client";
import { useEffect } from "react";
import clsx from "clsx";
import { FullConversationType } from "@/types";
import useConversation from "@/hooks/messenger/useConversation";
//import { pusherClient } from "@/lib/pusher";
import ConversationBox from "./ConversationBox";
import SubToggle from "./notificationButton";
import { registerServiceWorker } from "@/hooks/messenger/serviceWorker";
import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from "@/actions/chat/pushService";
import axios from "axios";
import { UserInfo } from "next-auth";
import { OutfitFont } from "@/components/fonts";

interface ConversationListProps {
  initialItems: FullConversationType[];
  title?: string;
  user?: UserInfo | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  user,
}) => {
  const items = initialItems;

  const { conversationId, isOpen } = useConversation();

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
        if (!user?.subscriptions)
          await axios.post("/api/useractions/update", {
            subscriptions: "[]",
          });
      } catch (error) {
        console.error(error);
      }
    }
    setUpServiceWorker();
  });

  useEffect(() => {
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error(error);
      }
    }
    syncPushSubscription();
  }, []);

  return (
    <>
      <aside
        className={clsx(
          `fixed inset-y-6 sm:inset-y-20 pb-20 lg:pb-0 lg:w-80 lg:block overflow-y-auto border-r-[1px]`,
          isOpen ? "" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex  mb-4 items-center justify-between">
            <div className={`${OutfitFont.className} text-2xl font-medium`}>
              Messages
            </div>
            <SubToggle />
          </div>

          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              user={user}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
