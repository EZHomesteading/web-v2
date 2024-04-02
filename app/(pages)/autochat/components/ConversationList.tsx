"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import clsx from "clsx";
import { find, uniq } from "lodash";

import { FullConversationType } from "@/types";
import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/libs/pusher";
import GroupChatModal from "@/app/components/modals/chatmodals/GroupChatModal";
import ConversationBox from "./ConversationBox";
import SubToggle from "./notificationButton";
import { registerServiceWorker } from "@/hooks/serviceWorker";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  sendPushSubscriptionToServer,
  unregisterPushNotifications,
} from "@/app/actions/notifications/pushService";
import axios from "axios";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
        if (!session.data?.user?.subscriptions)
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

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
    };

    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:remove", removeHandler);
  }, [pusherKey, router]);

  return (
    <>
      <SessionProvider>
        <GroupChatModal
          users={users}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <aside
          className={clsx(
            `
        fixed
        inset-y-20
        pb-20
        lg:pb-0
      
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
            isOpen ? "hidden" : "block w-full left-0"
          )}
        >
          <div className="px-5">
            <div className="flex justify-between mb-4 pt-4">
              <div className="text-2xl font-bold text-neutral-800">
                Messages
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
              >
                <MdOutlineGroupAdd size={20} />
              </div>{" "}
              <div
                className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
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
      </SessionProvider>
    </>
  );
};

export default ConversationList;
