import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/modals/chatmodals/LoadingModal";
import { SafeUser } from "@/types";

interface UserBoxProps {
  data: SafeUser;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", { userId: data.id })

      .then((datas) => {
        axios.post("/api/messages", {
          message:
            "(user) has ordered (insert item) from you, with expected pick up time(insert time), please click confirm when their order is ready to be picked up",
          messageOrder: "1",
          conversationId: datas.data.id,
          otherUserId: data.id,
        });
        router.push(`/autochat/${datas.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
