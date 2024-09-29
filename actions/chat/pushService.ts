//action to initialise service workers for any user on any browser
// Importing the getReadyServiceWorker function from a separate file
import { getReadyServiceWorker } from "@/hooks/messenger/serviceWorker";

// This function returns the current push subscription, if any
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  // Get the ready service worker instance
  const sw = await getReadyServiceWorker();
  // Return the current push subscription, if any
  return sw.pushManager.getSubscription();
}

// This function registers for push notifications
export async function registerPushNotifications() {
  // Check if the browser supports push notifications
  if (!("PushManager" in window)) {
    throw Error("Push notifications are not supported by this browser");
  }

  // Get the current push subscription, if any
  const existingSubscription = await getCurrentPushSubscription();
  // If an existing subscription is found, throw an error
  if (existingSubscription) {
    throw Error("Existing push subscription found");
  }

  // Get the ready service worker instance
  const sw = await getReadyServiceWorker();
  // Subscribe to push notifications
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true, // Only allow user-visible notifications
    applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY, // Use the public key from environment variables
  });

  // Send the new push subscription to the server
  await sendPushSubscriptionToServer(subscription);
}

// This function unregisters from push notifications
export async function unregisterPushNotifications() {
  // Get the current push subscription, if any
  const existingSubscription = await getCurrentPushSubscription();
  // If no existing subscription is found, throw an error
  if (!existingSubscription) {
    throw Error("No existing push subscription found");
  }

  // Delete the push subscription from the server
  await deletePushSubscriptionFromServer(existingSubscription);
  // Unsubscribe from push notifications
  await existingSubscription.unsubscribe();
}

// This function sends the push subscription to the server
export async function sendPushSubscriptionToServer(
  subscription: PushSubscription
) {
  const response = await fetch("../api/register-push", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
  if (!response.ok) {
    throw Error("failed sub push");
  }
}

// This function deletes the push subscription from the server
export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription
) {
  const response = await fetch("../api/register-push", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });
  if (!response.ok) {
    throw Error("failed sub delete");
  }
}
