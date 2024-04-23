"use client";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import Loader from "@/app/components/secondary-loader";
import { UserInfo } from "@/next-auth";

interface Props {
  user?: UserInfo;
}
const AccountOnboardingUI = ({ user }: Props) => {
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

    const initializeConnect = () => {
      const instance = loadConnectAndInitialize({
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        fetchClientSecret: fetchClientSecret,
      });
      setStripeConnectInstance(instance);
    };

    initializeConnect();
  }, [body]);

  if (!stripeConnectInstance) {
    return <Loader />;
  }

  return (
    <>
      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        <ConnectAccountOnboarding
          onExit={() => {
            console.log("The account has exited onboarding");
          }}
          fullTermsOfServiceUrl="https://ezhomesteading.vercel.app/tos"
          recipientTermsOfServiceUrl="https://ezhomesteading.vercel.app/tos-recipient"
          privacyPolicyUrl="https://ezhomesteading.vercel.app/privacy-policy"
          skipTermsOfServiceCollection={false}
          collectionOptions={{
            fields: "eventually_due",
            futureRequirements: "include",
          }}
        />
      </ConnectComponentsProvider>
    </>
  );
};

export default AccountOnboardingUI;
