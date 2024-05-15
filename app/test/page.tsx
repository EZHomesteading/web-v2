"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
interface p {
  user?: any;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
const Page = ({ user }: p) => {
  const [image, setImage] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="p-2 rounded-lg">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dispute delivery</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Dispute Delivery</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-row justify-start items-center ">
                <Label htmlFor="email" className="text-right mr-1 w-[50px]">
                  Email
                </Label>
                <Input id="name" value={user?.email || ""} className="" />
              </div>

              <div className="flex flex-row items-center">
                <Label htmlFor="username" className="text-right mr-1">
                  Phone
                </Label>
                <Input
                  id="number"
                  value={user?.phoneNumber || ""}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-4 items-start justify-start">
                <Label htmlFor="username" className="text-right">
                  Reason for Dispute
                </Label>
                <Select>
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
                    onClientUploadComplete={(res: any) => {
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
                )}
                Add additional comments <Textarea />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
