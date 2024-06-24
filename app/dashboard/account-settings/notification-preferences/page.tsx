"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useCurrentUser } from "@/hooks/user/use-current-user";

const Notification: { [key: string]: string } = {
  SMS_ALL_ORDERS: "SMS_ALL_ORDERS",
  EMAIL_ALL_ORDERS: "EMAIL_ALL_ORDERS",
  SMS_NEW_ORDERS: "SMS_NEW_ORDERS",
  EMAIL_NEW_ORDERS: "EMAIL_NEW_ORDERS",
  SMS_ORDER_UPDATES: "SMS_ORDER_UPDATES",
  EMAIL_ORDER_UPDATES: "EMAIL_ORDER_UPDATES",
  SMS_ORDER_CANCELED: "SMS_ORDER_CANCELED",
  EMAIL_ORDER_CANCELED: "EMAIL_ORDER_CANCELED",
  SMS_ORDER_COMPLETED: "SMS_ORDER_COMPLETED",
  EMAIL_ORDER_COMPLETED: "EMAIL_ORDER_COMPLETED",
  SMS_FOLLOWED_USER_LISTING: "SMS_FOLLOWED_USER_LISTING",
  EMAIL_FOLLOWED_USER_LISTING: "EMAIL_FOLLOWED_USER_LISTING",
  SMS_NEW_PRODUCER_LISTINGS: "SMS_NEW_PRODUCER_LISTINGS",
  EMAIL_NEW_PRODUCER_LISTINGS: "EMAIL_NEW_PRODUCER_LISTINGS",
};

const Page = () => {
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const [notificationPreferences, setNotificationPreferences] = useState<
    string[]
  >(user?.notifications ? Object.values(user.notifications) : []);

  const handleRadioChange = (value: any) => {
    if (value === "disable") {
      setNotificationPreferences([]);
    } else if (value === "sms-email") {
      setNotificationPreferences(Object.values(Notification));
    } else if (value === "comfortable") {
      setNotificationPreferences(
        Object.values(Notification).filter((pref) => pref.startsWith("SMS_"))
      );
    } else if (value === "compact") {
      setNotificationPreferences(
        Object.values(Notification).filter((pref) => pref.startsWith("EMAIL_"))
      );
    }
  };

  const handleCheckboxChange = (pref: any, checked: any) => {
    if (checked) {
      setNotificationPreferences([...notificationPreferences, pref]);
    } else {
      setNotificationPreferences(
        notificationPreferences.filter((p) => p !== pref)
      );
    }
  };

  const handleApplyToSMS = () => {
    const emailPreferences = notificationPreferences.filter((pref: any) =>
      pref.startsWith("EMAIL_")
    );
    const smsPreferences = emailPreferences.map((pref: any) =>
      pref.replace("EMAIL_", "SMS_")
    );
    setNotificationPreferences([...notificationPreferences, ...smsPreferences]);
  };

  const handleApplyToEmail = () => {
    const smsPreferences = notificationPreferences.filter((pref: any) =>
      pref.startsWith("SMS_")
    );
    const emailPreferences = smsPreferences.map((pref: any) =>
      pref.replace("SMS_", "EMAIL_")
    );
    setNotificationPreferences([
      ...notificationPreferences,
      ...emailPreferences,
    ]);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await axios.post("/api/update", {
        notifications: notificationPreferences,
      });
      toast.success("Your notification preferences have been updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      window.location.reload();
      setIsLoading(false);
    }
  };

  const isAllSMSEnabled =
    notificationPreferences.filter((pref: any) => pref.startsWith("SMS_"))
      .length ===
    Object.values(Notification).filter((pref) => pref.startsWith("SMS_"))
      .length;

  const isAllEmailEnabled =
    notificationPreferences.filter((pref: any) => pref.startsWith("EMAIL_"))
      .length ===
    Object.values(Notification).filter((pref) => pref.startsWith("EMAIL_"))
      .length;

  const selectedRadioValue =
    isAllSMSEnabled && isAllEmailEnabled
      ? "sms-email"
      : isAllSMSEnabled
      ? "comfortable"
      : isAllEmailEnabled
      ? "compact"
      : notificationPreferences.length === 0
      ? "disable"
      : "custom";

  return (
    <div className="flex flex-col gap-y-8 px-2 lg:px-40 mb-8">
      <h1 className="sr-only">Notification Settings</h1>
      <header className="flex flex-row justify-between items-center mt-1">
        <h2 className="text-base font-semibold leading-7">
          Notification Preferences
        </h2>
        <Button
          type="submit"
          onClick={onSubmit}
          className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          Save Changes
        </Button>
      </header>
      <Card>
        <CardContent className="flex flex-col sheet border-none shadow-lg w-full">
          <div className="flex flex-row items-center justify-between m-0 p-0 pt-2">
            <div>
              <h1 className="text-lg lg:text-3xl">
                General Notification Settings
              </h1>
              <ul>
                <li>
                  Quickly toggle all notifications on and off, click save to
                  update your preferences.
                </li>
              </ul>
              <RadioGroup
                value={selectedRadioValue}
                onValueChange={handleRadioChange}
                className="gap-y-4 my-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="r1" />
                  <Label htmlFor="r1">Custom configuration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms-email" id="r2" />
                  <Label htmlFor="r2">
                    Receive SMS & Email notifications for all orders and users
                    you follow
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r3" />
                  <Label htmlFor="r3">
                    Only receive SMS notifications for all orders and users you
                    follow
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="r4" />
                  <Label htmlFor="r4">
                    Only receive email notifications for all orders and users
                    you follow
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disable" id="r5" />
                  <Label htmlFor="r5">
                    Disable all Email & SMS notifications
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            Notifications are highly recommended for sellers.
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col sheet border-none shadow-lg w-full">
          <div className="flex flex-row items-center justify-between m-0 p-0 pt-2">
            <div className="w-full">
              <div className="flex flex-row justify-between w-full">
                <div>
                  <h1 className="text-lg lg:text-3xl">
                    SMS Notification Settings
                  </h1>
                  <ul>
                    <li>Choose when you want to receive SMS notifications</li>
                  </ul>
                </div>
                <div>
                  <Button onClick={handleApplyToEmail}>Apply to Email</Button>
                </div>
              </div>
              <h1 className="text-2xl">
                I want to receive order notifications when...
              </h1>
              <ul className="flex flex-col gap-y-2">
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={isAllSMSEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNotificationPreferences([
                          ...notificationPreferences,
                          ...Object.values(Notification).filter((pref) =>
                            pref.startsWith("SMS_")
                          ),
                        ]);
                      } else {
                        setNotificationPreferences(
                          notificationPreferences.filter(
                            (pref: any) => !pref.startsWith("SMS_")
                          )
                        );
                      }
                    }}
                  />
                  <Label>I want to receive all order updates via SMS</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.SMS_NEW_ORDERS
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(Notification.SMS_NEW_ORDERS, checked)
                    }
                  />
                  <Label>I have a new order</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.SMS_ORDER_UPDATES
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.SMS_ORDER_UPDATES,
                        checked
                      )
                    }
                  />
                  <Label>There is an update to my order</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.SMS_ORDER_CANCELED
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.SMS_ORDER_CANCELED,
                        checked
                      )
                    }
                  />
                  <Label>The buyer cancels the order</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.SMS_ORDER_COMPLETED
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.SMS_ORDER_COMPLETED,
                        checked
                      )
                    }
                  />
                  <Label>The order is completed</Label>
                </li>
              </ul>
              <h2 className="text-2xl">
                I want to receive SMS notifications when...
              </h2>
              <ul className="flex flex-col gap-y-2">
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.SMS_FOLLOWED_USER_LISTING
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.SMS_FOLLOWED_USER_LISTING,
                        checked
                      )
                    }
                  />
                  <Label>A farmer I follow posts a new listing</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.SMS_NEW_PRODUCER_LISTINGS
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.SMS_NEW_PRODUCER_LISTINGS,
                        checked
                      )
                    }
                  />
                  <Label>There are new listings from farmers near me</Label>
                </li>
              </ul>
            </div>
          </div>
          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            Notifications are highly recommended for sellers.
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col sheet border-none shadow-lg w-full">
          <div className="flex flex-row items-center justify-between m-0 p-0 pt-2">
            <div className="w-full">
              <div className="flex flex-row justify-between w-full">
                <div>
                  <h1 className="text-lg lg:text-3xl">
                    Email Notification Settings
                  </h1>
                  <ul>
                    <li>Choose when you want to receive email notifications</li>
                  </ul>
                </div>
                <div>
                  <Button onClick={handleApplyToSMS}>Apply to SMS</Button>
                </div>
              </div>
              <h1 className="text-2xl">
                I want to receive order notifications when...
              </h1>
              <ul className="flex flex-col gap-y-2">
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={isAllEmailEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNotificationPreferences([
                          ...notificationPreferences,
                          ...Object.values(Notification).filter((pref) =>
                            pref.startsWith("EMAIL_")
                          ),
                        ]);
                      } else {
                        setNotificationPreferences(
                          notificationPreferences.filter(
                            (pref: any) => !pref.startsWith("EMAIL_")
                          )
                        );
                      }
                    }}
                  />
                  <Label>I want to receive all order updates via email</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.EMAIL_NEW_ORDERS
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.EMAIL_NEW_ORDERS,
                        checked
                      )
                    }
                  />
                  <Label>I have a new order</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.EMAIL_ORDER_UPDATES
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.EMAIL_ORDER_UPDATES,
                        checked
                      )
                    }
                  />
                  <Label>There is an update to my order</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.EMAIL_ORDER_CANCELED
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.EMAIL_ORDER_CANCELED,
                        checked
                      )
                    }
                  />
                  <Label>The buyer cancels the order</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.EMAIL_ORDER_COMPLETED
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.EMAIL_ORDER_COMPLETED,
                        checked
                      )
                    }
                  />
                  <Label>The order is completed</Label>
                </li>
              </ul>
              <h2 className="text-2xl">
                I want to receive email notifications when...
              </h2>
              <ul className="flex flex-col gap-y-2">
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.EMAIL_FOLLOWED_USER_LISTING
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.EMAIL_FOLLOWED_USER_LISTING,
                        checked
                      )
                    }
                  />
                  <Label>A farmer I follow posts a new listing</Label>
                </li>
                <li className="flex flex-row items-center">
                  <Checkbox
                    className="mr-1 h-5 w-5"
                    checked={notificationPreferences.includes(
                      Notification.EMAIL_NEW_PRODUCER_LISTINGS
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        Notification.EMAIL_NEW_PRODUCER_LISTINGS,
                        checked
                      )
                    }
                  />
                  <Label>There are new listings from farmers near me</Label>
                </li>
              </ul>
            </div>
          </div>
          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            Notifications are highly recommended for sellers.
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
