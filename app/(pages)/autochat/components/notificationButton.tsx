"use client";

import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/actions/messenger/pushService";
import Loading from "@/app/loading";
import { BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SubToggle = () => {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();
  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    if (loading) return;
    setLoading(true);
    setConfirmationMessage(undefined);
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setConfirmationMessage(
        "Push notifications " + (enabled ? "disabled" : "enabled")
      );
      setHasActivePushSubscription(enabled);
      if (confirmationMessage) {
        toast.success(confirmationMessage);
      }
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong please try again");
      }
    } finally {
      setLoading(false);
    }
  }
  if (hasActivePushSubscription === undefined) return null;

  return (
    <div className="relative">
      {loading && (
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Loading />
        </span>
      )}
      {hasActivePushSubscription ? (
        <span title="Disable push notifications for this device?">
          <BellRing
            onClick={() => setPushNotificationsEnabled(false)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""} `}
          />
        </span>
      ) : (
        <span title="Enable push notifications for this device?">
          <BellOff
            onClick={() => setPushNotificationsEnabled(true)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""} `}
          />
        </span>
      )}
    </div>
  );
};
export default SubToggle;
