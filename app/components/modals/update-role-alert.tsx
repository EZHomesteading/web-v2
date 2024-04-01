import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import homebg from "@/public/images/home-images/ezh-modal.jpg";
import { Button } from "@/app/components/ui/button";
import Cancel from "@/app/components/ui/cancel";
import Link from "next/link";
import { CiCircleInfo } from "react-icons/ci";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import Image from "next/image";

interface UpdateRoleAlertProps {
  heading: string;
  description: string;
  backButtonLabel: string;
  actionButtonLabel: string;
  actionButtonHref: string;
  actionButtonLabelTwo: string;
  actionButtonHrefTwo: string;
  actionButtonLabelThree: string;
  actionButtonHrefThree: string;
}

export function UpdateRoleAlert({
  heading,
  description,
  actionButtonHref,
  actionButtonLabel,
  actionButtonHrefTwo,
  actionButtonLabelTwo,
  actionButtonHrefThree,
  actionButtonLabelThree,
}: UpdateRoleAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add a Product</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-green-900 rounded-lg w-full h-4/5 md:w-1/2 md:h-1/2 flex flex-row justify-evenly z-1000">
        <Image
          src={homebg}
          alt="Farmer Holding Basket of Vegetables"
          blurDataURL="data:..."
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <AlertDialogHeader>
          <AlertDialogTitle>{heading}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel className="absolute top-2 right-2 border-none">
          <Cancel />
        </AlertDialogCancel>
        <div className="text-white flex flex-col sm:flex-row">
          <AlertDialogAction>
            <Link href={actionButtonHref}>
              <Button variant="outline" className="w-full shadow-none">
                <CiCircleInfo className="mr-2" />
                {actionButtonLabel}
              </Button>
            </Link>
          </AlertDialogAction>
          <AlertDialogAction className="">
            <Link href={actionButtonHrefTwo}>
              <Button variant="outline">
                <IoStorefrontOutline className="mr-2" />
                {actionButtonLabelTwo}
              </Button>
            </Link>
          </AlertDialogAction>
          <AlertDialogAction className="">
            <Link href={actionButtonHrefThree}>
              <Button variant="outline">
                <GiFruitTree className="mr-2" />
                {actionButtonLabelThree}
              </Button>
            </Link>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
