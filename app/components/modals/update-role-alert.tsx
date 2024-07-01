//update role modal
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
import Cancel from "@/app/components/icons/cancel-svg";
import Link from "next/link";
import { CiCircleInfo, CiSquarePlus } from "react-icons/ci";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

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
  const pathname = usePathname();
  const white = pathname === "/" || pathname?.startsWith("/chat");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <CiSquarePlus
          className={`${
            white ? "text-white" : "text-black"
          } text-sm sm:text-lg md:text-2xl shadow-none bg-inherit hover:cursor-pointer rounded-full mr-1 h-8 w-8`}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="xl:w-2/3 2xl:w-1/2 w-5/6  h-1/2 sm:aspect-square md:aspect-video overflow-hidden authlayoutbg rounded-xl flex">
        <div className="relative hidden lg:block lg:w-1/3 h-full">
          <Image
            src={homebg}
            alt="Farmer Holding Basket of Vegetables"
            placeholder="blur"
            className="rounded-l-lg object-cover"
            fill
          />
        </div>
        <div className={`${outfit.className} p-2 mt-10 lg:w-2/3`}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              {heading}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel className="absolute top-2 right-2 border-none bg-transparent">
            <Cancel />
          </AlertDialogCancel>
          <div className="flex gap-1 mt-3 flex-col items-center w-full sm:flex-row">
            <AlertDialogAction className="bg shadow-xl w-[180px]">
              <Link
                href={actionButtonHref}
                className="flex flex-row items-center text-black gap-x-1"
              >
                <CiCircleInfo className="" />
                {actionButtonLabel}
              </Link>
            </AlertDialogAction>
            <AlertDialogAction className="bg shadow-xl w-[180px]">
              <Link
                href={actionButtonHrefTwo}
                className="flex flex-row items-center text-black gap-x-1"
              >
                <IoStorefrontOutline className="" />
                {actionButtonLabelTwo}
              </Link>
            </AlertDialogAction>
            <AlertDialogAction className="bg shadow-xl w-[180px]">
              <Link
                href={actionButtonHrefThree}
                className="flex flex-row items-center text-black gap-x-1"
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
