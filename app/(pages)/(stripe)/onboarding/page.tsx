"use client";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCurrentUser } from "@/hooks/use-current-user";

const AccountOnboardingUI = () => {
  const user = useCurrentUser();
  const body = user?.stripeAccountId;

  const [stripeConnectInstance, setStripeConnectInstance] = useState<
    any | null
  >(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post("/api/stripe/account-session", {
          stripeAccountId: body,
        });
        const { client_secret: clientSecret } = response.data;
        console.log(clientSecret);
        return clientSecret;
      } catch (error) {
        console.error("An error occurred: ", error);
        return undefined;
      }
    };

    const initializeConnect = async () => {
      const instance = await loadConnectAndInitialize({
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        fetchClientSecret: fetchClientSecret,
      });
      setStripeConnectInstance(instance);
    };

    initializeConnect();
  }, [body]);

  if (!stripeConnectInstance) {
    return <div>ezh onboarding</div>;
  }

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => {
          console.log("The account has exited onboarding");
        }}
        fullTermsOfServiceUrl="http://localhost:3000/tos"
        recipientTermsOfServiceUrl="http://localhost:3000/tos-recipient"
        privacyPolicyUrl="http://localhost:3000/privacy-policy"
        skipTermsOfServiceCollection={false}
        collectionOptions={{
          fields: "eventually_due",
          futureRequirements: "include",
        }}
      />
    </ConnectComponentsProvider>
  );
};

export default AccountOnboardingUI;
