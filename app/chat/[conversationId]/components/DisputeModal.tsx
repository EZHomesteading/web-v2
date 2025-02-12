"use client";
//modal for users to be able to submit a transaction dispute for later review by admins
import Modal from "@/components/modals/chatmodals/Modal";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";

import { BsBucket } from "react-icons/bs";
import { ChatUser } from "chat-types";

interface p {
  user?: ChatUser;
  isOpen?: boolean;
  onClose: () => void;
  orderId: string | undefined;
  conversationId: string | null | undefined;
  otherUserId: string | undefined;
}

const DisputeModal = ({
  user,
  isOpen,
  onClose,
  orderId,
  conversationId,
  otherUserId,
}: p) => {
  const [image, setImage] = useState("");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const handleSubmit = async () => {
    const data = {
      userId: user?.id,
      orderId: orderId,
      email: email,
      phone: phone,
      images: image ? [image] : [],
      reason,
      explanation: comments,
      status: "DISPUTED",
    };
    try {
      await axios.post("/api/chat/dispute", data);
      axios.post("/api/useractions/checkout/update-order", {
        orderId: orderId,
        status: "DISPUTED",
      });
      await axios.post("/api/chat/messages", {
        message: `${data.images[0]}`,
        messageOrder: "IMG",
        conversationId: conversationId,
        otherUserId: otherUserId,
      });
      await axios.post("/api/chat/messages", {
        message: `I am disputing this order because: ${data.explanation}`,
        messageOrder: "DISPUTED",
        conversationId: conversationId,
        otherUserId: otherUserId,
      });
      onClose();
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="">
        <div className="p-2 rounded-lg">
          <Dialog>
            <DialogHeader>
              <DialogTitle>Dispute Delivery</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-row justify-start items-center ">
                <Label htmlFor="email" className="text-right mr-1 w-[50px]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  className=""
                  onChange={handleEmailChange}
                />
              </div>

              <div className="flex flex-row items-center">
                <Label htmlFor="phone" className="text-right mr-1">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-4 items-start justify-start">
                <Label htmlFor="reason" className="text-right">
                  Reason for Dispute
                </Label>
                <Select
                  onValueChange={(value) => setReason(value)}
                  value={reason}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="NO_DELIVERY">
                        Items weren't delivered
                      </SelectItem>
                      <SelectItem value="SPOILED">
                        Items were spoiled
                      </SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {!image && (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      setImage(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    appearance={{
                      container: "h-full w-max",
                    }}
                    className="ut-allowed-content:hidden ut-button:bg-blue-800 ut-button:text-white ut-button:w-fit ut-button:px-2 ut-button:p-3"
                    content={{
                      button({ ready }) {
                        if (ready) return <div>Photo of the Items</div>;
                        return "Getting ready...";
                      },
                    }}
                  />
                )}
                {image && (
                  <>
                    <div className="m-5 relative">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Image
                            src={image}
                            height={180}
                            width={180}
                            alt="a"
                            className="aspect-square rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                            Click to Enlarge
                          </div>
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();

                              setImage("");
                            }}
                          >
                            {" "}
                            <BsBucket />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="z flex justify-center items-center w-screen h-screen">
                          <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                            {" "}
                            <div>
                              <Image
                                src={image}
                                fill
                                className="object-cover w-full"
                                alt="a"
                              />
                            </div>
                            <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                              Close
                            </AlertDialogCancel>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}{" "}
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add additional comments"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                Send
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    </Modal>
  );
};

export default DisputeModal;
