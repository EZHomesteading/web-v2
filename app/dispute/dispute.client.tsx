"use client";
//admin only disputes page
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Popover } from "@/app/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Outfit } from "next/font/google";
import FilterButtons from "@/app/dispute/dispute-filters";
import { $Enums, UserRole } from "@prisma/client";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { ExplanationDialog } from "./dispute.explanation";
const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
const statusTexts: { [key: number]: string } = {
  0: "UNRESOLVED",
  1: "RESOLVED",
  2: "ESCALATED",
  3: "CLOSED",
};

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export type Dispute = {
  order: {
    conversationId: string | null;
    buyer: {
      id: string;
      createdAt: Date;
      email: string;
      firstName: string | null;
      phoneNumber: string | null;
      role: $Enums.UserRole;
    } | null;
    seller: {
      id: string;
      createdAt: Date;
      email: string;
      firstName: string | null;
      phoneNumber: string | null;
      role: $Enums.UserRole;
    } | null;
  };
  id: string;
  userId: string;
  createdAt: Date;
  email: string;
  updatedAt: Date;
  status: number;
  explanation: string;
  phone: string;
  images: string[];
  reason: $Enums.DisputeReason;
};

interface p {
  disputes: Dispute[];
}
interface ConfirmVisibilityState {
  [key: string]: {
    approve: boolean;
    deny: boolean;
  };
}

type ConfirmAction = "approve" | "deny";
const DisputeComponent = ({ disputes }: p) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDisputes, setFilteredDisputes] = useState(disputes);
  const [isConfirmVisible, setIsConfirmVisible] =
    useState<ConfirmVisibilityState>({});
  const handleDenyAndConfirm = async (
    dispute: Dispute,
    explanation: string
  ) => {
    setIsLoading(true);

    const emailParams = {
      Destination: {
        ToAddresses: [
          dispute?.order?.buyer?.email,
          dispute?.order?.seller?.email,
        ].filter((email): email is string => email !== undefined),
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <p>Dear ${dispute?.order?.buyer?.firstName} and ${
              dispute?.order?.seller?.firstName
            },</p>
              <p>This email is regarding the dispute for order #${
                dispute.order.conversationId
              }.</p>
              <p>After reviewing the details of the dispute, the resolution is as follows:</p>
              <p>${explanation}</p>
              <p>The dispute has been marked as ${
                statusTexts[dispute.status]
              }.</p>
              <p>If you have any further questions or concerns, please feel free to reach out to our support team.</p>
              <p>Best regards,</p>
              <p>EzHomesteading Dispute Resolution Team</p>
            `,
          },
        },
        Subject: {
          Data: "Order Dispute Update",
        },
      },
      Source: "no-reply@ezhomesteading.com",
    };

    try {
      await sesClient.send(new SendEmailCommand(emailParams));
      console.log("Email sent to the seller");
    } catch (error) {
      console.error("Error sending email to the seller:", error);
    }
  };
  const toggleConfirmVisibility = (
    action: ConfirmAction,
    disputeId: string
  ) => {
    setIsConfirmVisible((prevState: ConfirmVisibilityState) => ({
      ...prevState,
      [disputeId]: {
        ...prevState[disputeId],
        [action]: !prevState[disputeId]?.[action],
      },
    }));
  };

  useEffect(() => {
    if (disputes) {
      setIsLoading(false);
    }
  }, [disputes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!disputes || disputes.length === 0) {
    return <div>No disputes found</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="grid grid-cols-10 fixed top-0 left-0 right-0 bg-gray-800 text-white py-2">
        <div className="col-span-1 text-center">Dispute Filer Info</div>
        <div className="col-span-1 text-center">Filed Against</div>
        <div className="col-span-1 text-center">Reason</div>
        <div className="col-span-1 text-center">Images</div>
        <div className="col-span-1 text-center">Created</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Explanation</div>

        <div className="col-span-1 flex justify-center">
          <FilterButtons
            disputes={disputes}
            setFilteredDisputes={setFilteredDisputes}
          />
        </div>
      </div>
      <div className="pt-12">
        {filteredDisputes.map((dispute: Dispute) => (
          <div key={dispute.id} className="grid grid-cols-10 items-start ">
            <div>
              {dispute.userId === dispute?.order?.buyer?.id ? (
                <Popover>
                  <PopoverTrigger className="col-span-1 border p-1 w-full">
                    <p>{dispute.order.buyer.role}</p>
                  </PopoverTrigger>
                  <PopoverContent
                    className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                  >
                    <p>Email: {dispute.order.buyer.email}</p>
                    <p>Phone: {dispute.order.buyer.phoneNumber}</p>
                    <p>
                      Joined:{" "}
                      {formatDistanceToNow(
                        new Date(dispute.order.buyer.createdAt),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger className="col-span-1 border p-1 w-full">
                    <p>{dispute?.order?.seller?.role}</p>
                  </PopoverTrigger>
                  <PopoverContent
                    className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                  >
                    <p>Email: {dispute?.order?.seller?.email}</p>
                    <p>Phone: {dispute?.order?.seller?.phoneNumber}</p>
                    <p>
                      Joined:{" "}
                      {formatDistanceToNow(
                        new Date(dispute.order.seller?.createdAt as Date),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div>
              {dispute.userId === dispute.order.buyer?.id ? (
                <Popover>
                  <PopoverTrigger className="col-span-1 border p-1 w-full">
                    <p>{dispute.order.seller?.role}</p>
                  </PopoverTrigger>
                  <PopoverContent
                    className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                  >
                    <p>Email: {dispute.order.seller?.email}</p>
                    <p>Phone: {dispute.order.seller?.phoneNumber}</p>
                    <p>
                      Joined:{" "}
                      {formatDistanceToNow(
                        new Date(dispute.order.seller?.createdAt as Date),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger className="col-span-1 border p-1 w-full">
                    <p>{dispute.order.buyer?.role}</p>
                  </PopoverTrigger>
                  <PopoverContent
                    className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                  >
                    <p>Email: {dispute.order.buyer?.email}</p>
                    <p>Phone: {dispute.order.buyer?.phoneNumber}</p>
                    <p>
                      Joined:{" "}
                      {formatDistanceToNow(
                        new Date(dispute.order.buyer?.createdAt as Date),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="col-span-1 border p-1">
              <p>{dispute.reason}</p>
            </div>
            <Popover>
              <PopoverTrigger className="col-span-1 border p-1">
                Images
              </PopoverTrigger>
              <PopoverContent
                className={`${outfit.className} rounded-lg text-black p-2 sheet`}
              >
                {dispute.images.map((image: string, index: number) => (
                  <Image
                    key={index}
                    src={image}
                    rounded-lg
                    text-black
                    alt={`Dispute Image ${index}`}
                    height={1000}
                    width={1000}
                  />
                ))}
              </PopoverContent>
            </Popover>
            <div className="col-span-1 border p-1">
              <p>
                {formatDistanceToNow(new Date(dispute.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="col-span-1 border p-1">
              <p>{statusTexts[dispute.status] || "UNKNOWN"}</p>
            </div>

            <Popover>
              <PopoverTrigger className="col-span-1 border p-1">
                {dispute.explanation.length > 20
                  ? `${dispute.explanation.slice(0, 20)}...`
                  : dispute.explanation}
              </PopoverTrigger>
              <PopoverContent
                className={`${outfit.className} rounded-lg text-black p-2 sheet`}
              >
                <p>{dispute.explanation}</p>
              </PopoverContent>
            </Popover>

            <div className="col-span-1 flex justify-center">
              {isConfirmVisible[dispute.id]?.approve ? (
                <ExplanationDialog
                  onConfirm={(explanation) =>
                    handleDenyAndConfirm(dispute, explanation)
                  }
                />
              ) : (
                <Button
                  onClick={() => toggleConfirmVisibility("approve", dispute.id)}
                >
                  Approve
                </Button>
              )}
            </div>
            <div className="col-span-1 flex justify-center">
              {isConfirmVisible[dispute.id]?.deny ? (
                <ExplanationDialog
                  onConfirm={(explanation) =>
                    handleDenyAndConfirm(dispute, explanation)
                  }
                />
              ) : (
                <Button
                  onClick={() => toggleConfirmVisibility("deny", dispute.id)}
                >
                  Deny
                </Button>
              )}
            </div>
            <div className="col-span-1 flex justify-center">
              <Link href={`/chat/${dispute.order.conversationId}`}>
                <Button>Chat</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisputeComponent;
