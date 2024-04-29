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
import { CiCircleInfo, CiSquarePlus } from "react-icons/ci";
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
        <Button className="shadow-none bg-inherit hover:bg-green-100 rounded-full mr-1">
          <CiSquarePlus className="text-sm sm:text-lg md:text-2xl text-gray-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="grid grid-cols-1 lg:grid-cols-2 w-[90vw] h-[40vh] sm:w-[90vw] md:w-[50vw] xl:w-[vw] xl:h-[60vh] overflow-hidden authlayoutbg rounded-xl">
        <div className="relative hidden xl:block">
          <Image
            src={homebg}
            alt="Farmer Holding Basket of Vegetables"
            placeholder="blur"
            className="rounded-l-lg object-cover"
            fill
          />
        </div>
        <div className="mt-12 px-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              {heading}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel className="absolute top-1 right-1 border-none bg-transparent">
            <Cancel />
          </AlertDialogCancel>
          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <AlertDialogAction className="bg shadow-xl">
              <Link
                href={actionButtonHref}
                className="flex flex-row items-center text-black gap-x-2"
              >
                <CiCircleInfo className="" />
                {actionButtonLabel}
              </Link>
            </AlertDialogAction>
            <AlertDialogAction className="bg shadow-xl">
              <Link
                href={actionButtonHrefTwo}
                className="flex flex-row items-center text-black gap-x-2"
              >
                <IoStorefrontOutline className="mr-2" />
                {actionButtonLabelTwo}
              </Link>
            </AlertDialogAction>
            <AlertDialogAction className="bg shadow-xl">
              <Link
                href={actionButtonHrefThree}
                className="flex flex-row items-center text-black gap-x-2"
              >
                <GiFruitTree className="" />
                {actionButtonLabelThree}
              </Link>
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
