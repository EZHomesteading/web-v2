"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import ClientOnly from "@/app/components/client/ClientOnly";
import { useState } from "react";
import Button from "@/app/components/Button";
interface UpdateUserProps {
  user?: any | null;
}

const ConnectClient: React.FC<UpdateUserProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnectToStripe = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/stripe/create-connected-account",
        {
          userId: user?.id,
        }
      );

      if (response.status === 200) {
        toast.success("Connected successfully");
        router.push("/dashboard/my-store");
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }

    setIsLoading(false);
  };
  const handleOnBoardToStripe = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/stripe/custom-onboard", {
        stripeAccountId: user?.stripeAccountId,
      });

      if (response.status === 200) {
        toast.success("Onboard");
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }

    setIsLoading(false);
  };
  const handleAcceptTOS = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/stripe/accept-tos", {
        stripeAccountId: user?.stripeAccountId,
      });

      if (response.status === 200) {
        toast.success("Connected successfully");
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }

    setIsLoading(false);
  };

  return (
    <ClientOnly>
      <div>
        {user ? (
          <div>
            <p>{user.name}</p>
            <div className="flex flex-col  justify-center h-screen gap-y-2 ">
              {!user?.stripeAccountId && (
                <button onClick={handleConnectToStripe} disabled={isLoading}>
                  {isLoading ? "Connecting..." : "Connect"}
                </button>
              )}
              <button onClick={handleOnBoardToStripe} disabled={isLoading}>
                Onboard
              </button>
              <button onClick={handleAcceptTOS} disabled={isLoading}>
                Accept TOS
              </button>
            </div>
          </div>
        ) : (
          <p>No user found.</p>
        )}
      </div>
    </ClientOnly>
  );
};

export default ConnectClient;
