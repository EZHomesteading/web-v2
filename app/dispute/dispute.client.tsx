"use client";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Popover } from "../components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import Image from "next/image";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Dispute {
  id: string;
  userId: string;
  images: string[];
  status: string;
  reason: string;
  explanation: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  order: {
    conversationId: string;
    buyer: {
      id: string;
      email: string;
      phoneNumber: string;
      createdAt: Date;
    };
    seller: {
      id: string;
      email: string;
      phoneNumber: string;
      createdAt: Date;
    };
  };
}
interface p {
  disputes: any;
}
const DisputeComponent = ({ disputes }: p) => {
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="bg-black text-white">
      {disputes.map((dispute: any) => (
        <div
          key={dispute.id}
          className="grid grid-cols-10 items-start w-screen h-screen"
        >
          <div>
            {dispute.userId === dispute.order.buyer.id ? (
              <Popover>
                <PopoverTrigger className="col-span-1 border p-1 w-full">
                  <p>Dispute Filer Info</p>
                </PopoverTrigger>
                <PopoverContent
                  className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                >
                  <p>Email: {dispute.order.buyer.email}</p>
                  <p>Phone: {dispute.order.buyer.phoneNumber}</p>
                  <p>{dispute.order.buyer.role}</p>
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
                  <p>Dispute Filer Info</p>
                </PopoverTrigger>
                <PopoverContent
                  className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                >
                  <p>Email: {dispute.order.seller.email}</p>
                  <p>Phone: {dispute.order.seller.phoneNumber}</p>
                  <p>{dispute.order.seller.role}</p>
                  <p>
                    Joined:{" "}
                    {formatDistanceToNow(
                      new Date(dispute.order.seller.createdAt),
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
            {dispute.userId === dispute.order.buyer.id ? (
              <Popover>
                <PopoverTrigger className="col-span-1 border p-1 w-full">
                  <p>Dispute Filed Against</p>
                </PopoverTrigger>
                <PopoverContent
                  className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                >
                  <p>Email: {dispute.order.seller.email}</p>
                  <p>Phone: {dispute.order.seller.phoneNumber}</p>
                  <p>{dispute.order.seller.role}</p>
                  <p>
                    Joined:{" "}
                    {formatDistanceToNow(
                      new Date(dispute.order.seller.createdAt),
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
                  <p>Dispute Filed Against</p>
                </PopoverTrigger>
                <PopoverContent
                  className={`${outfit.className} rounded-lg text-black p-2 sheet`}
                >
                  <p>Email: {dispute.order.buyer.email}</p>
                  <p>Phone: {dispute.order.buyer.phoneNumber}</p>
                  <p>{dispute.order.buyer.role}</p>
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
            )}
          </div>
          <div className="col-span-1 border p-1">
            <p>
              {formatDistanceToNow(new Date(dispute.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className="col-span-1 border p-1">
            <p>Status: {dispute.status}</p>
          </div>
          <div className="col-span-1 border p-1">
            <p>{dispute.reason}</p>
          </div>
          <Popover>
            <PopoverTrigger className="col-span-1 border p-1">
              Explanation
            </PopoverTrigger>
            <PopoverContent
              className={`${outfit.className} rounded-lg text-black p-2 sheet`}
            >
              <p>{dispute.explanation}</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="col-span-1 border p-1">
              Images
            </PopoverTrigger>
            <PopoverContent
              className={`${outfit.className} rounded-lg text-black p-2 sheet`}
            >
              {dispute.images.map((image: any, index: number) => (
                <Image
                  key={index}
                  src={image}
                  rounded-lg
                  text-black
                  alt={`Dispute Image ${index}`}
                  height={100}
                  width={100}
                />
              ))}
            </PopoverContent>
          </Popover>

          <div className="col-span-1 flex justify-center">
            <Button>Approve</Button>
          </div>
          <div className="col-span-1 flex justify-center">
            <Button>Deny</Button>
          </div>
          <div className="col-span-1 flex justify-center">
            <Link href={`/chat/${dispute.order.conversationId}`}>
              <Button>Chat</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisputeComponent;
