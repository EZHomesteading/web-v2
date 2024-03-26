"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import ClientOnly from "@/app/components/client/ClientOnly";
import { useState } from "react";
import { SafeUser } from "@/app/types";

interface UpdateUserProps {
  currentUser?: SafeUser | null;
}

const ConnectClient: React.FC<UpdateUserProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnectToStripe = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/stripe/create-connected-account",
        {
          userId: currentUser?.id,
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

  return (
    <ClientOnly>
      <div>
        <h1>Connect to Stripe</h1>
        {currentUser ? (
          <div>
            <p>User: {currentUser.name}</p>
            <button onClick={handleConnectToStripe} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect"}
            </button>
          </div>
        ) : (
          <p>No user found.</p>
        )}
      </div>
    </ClientOnly>
  );
};

export default ConnectClient;
