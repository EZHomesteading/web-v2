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
import homebg from "@/public/images/website-images/ezh-modal.jpg";
import { Button } from "@/app/components/ui/button";
import Cancel from "@/app/components/icons/cancel-svg";
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
        <Button>Add a Product</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-lg w-full h-4/5 md:w-1/2 md:h-1/2 flex flex-row justify-start">
        <Image
          src={homebg}
          alt="Farmer Holding Basket of Vegetables"
          blurDataURL="data:..."
          placeholder="blur"
          height={800}
          className="rounded-l-lg"
        />
        <div className="mt-12 px-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              {heading}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel className="absolute top-2 right-2 border-none">
            <Cancel />
          </AlertDialogCancel>
          <div className="mt-10 flex flex-col sm:flex-row">
            <AlertDialogAction>
              <Link
                href={actionButtonHref}
                className="border-black shadow-none"
              >
                <Button variant="link" className="w-full  border-black">
                  <CiCircleInfo className="mr-2" />
                  {actionButtonLabel}
                </Button>
              </Link>
            </AlertDialogAction>
            <AlertDialogAction className="border-black shadow-none">
              <Link
                href={actionButtonHrefTwo}
                className="border-black shadow-none"
              >
                <Button variant="link" className="border-black shadow-none">
                  <IoStorefrontOutline className="mr-2" />
                  {actionButtonLabelTwo}
                </Button>
              </Link>
            </AlertDialogAction>
            <AlertDialogAction className="">
              <Link
                href={actionButtonHrefThree}
                className="border-black shadow-none"
              >
                <Button className="border-black shadow-none" variant="link">
                  <GiFruitTree className="mr-2" />
                  {actionButtonLabelThree}
                </Button>
              </Link>
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
