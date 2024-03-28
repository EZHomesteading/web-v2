"use client";

import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/app/actions/notifications/pushService";
import { BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";

const SubToggle = () => {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();
  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong please try again");
      }
    }
  }
  if (hasActivePushSubscription === undefined) return null;

  return (
    <div>
      {hasActivePushSubscription ? (
        <span title="Disable push notifications for this device?">
          <BellRing
            onClick={() => setPushNotificationsEnabled(false)}
            className="cursor-pointer"
          />
        </span>
      ) : (
        <span title="Enable push notifications for this device?">
          <BellOff
            onClick={() => setPushNotificationsEnabled(true)}
            className="cursor-pointer"
          />
        </span>
      )}
    </div>
  );
};
export default SubToggle;
