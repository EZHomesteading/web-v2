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
import { UserInfo } from "@/next-auth";

interface ConversationListProps {
  initialItems: FullConversationType[];
  title?: string;
  user?: UserInfo;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  user,
}) => {
  const items = initialItems;
  //const [items, setItems] = useState(initialItems);

  const { conversationId, isOpen } = useConversation();

  // const pusherKey = useMemo(() => {
  //   return session.data?.user?.email;
  // }, [session.data?.user?.email]);

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
        if (!user?.subscriptions)
          await axios.post("/api/update", {
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

  // useEffect(() => {
  //   if (!pusherKey) {
  //     return;
  //   }
  //   pusherClient.unsubscribe(pusherKey);
  //   pusherClient.subscribe(pusherKey);

  //   const updateHandler = (conversation: FullConversationType) => {
  //     setItems((current) =>
  //       current.map((currentConversation) => {
  //         if (currentConversation.id === conversation.id) {
  //           return {
  //             ...currentConversation,
  //             messages: conversation.messages,
  //           };
  //         }

  //         return currentConversation;
  //       })
  //     );
  //   };

  //   const newHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       if (find(current, { id: conversation.id })) {
  //         return current;
  //       }

  //       return [conversation, ...current];
  //     });
  //   };

  //   const removeHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       return [...current.filter((convo) => convo.id !== conversation.id)];
  //     });
  //   };

  //   pusherClient.bind("conversation:update", updateHandler);
  //   pusherClient.bind("conversation:new", newHandler);
  //   pusherClient.bind("conversation:remove", removeHandler);
  // }, [pusherKey, router]);

  return (
    <>
      <aside
        className={clsx(
          `fixed inset-y-20 pb-20 lg:pb-0 lg:w-80 lg:block overflow-y-auto border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4 items-center">
            <div className="text-2xl font-bold text-white">Messages</div>

            <div
              className="
                
              "
            >
              <SubToggle />
            </div>
          </div>

          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
