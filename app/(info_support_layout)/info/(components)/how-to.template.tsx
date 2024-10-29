import { Outfit, Zilla_Slab } from "next/font/google";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
});
const zilla = Zilla_Slab({
  weight: ["300"],
  subsets: ["latin"],
});
interface p {
  title: string;
  image1?: string;
  paragraphs: string[];
  subtitle?: string;
  explanation?: string;
  aspectRatio?: string;
}

const HowToTemplate = ({
  title,
  image1,
  paragraphs,
  subtitle,
  explanation,
  aspectRatio = "9/16",
}: p) => {
  return (
    <div className="sheet grid grid-cols-1 lg:grid-cols-5 py-8 px-4">
      <div className="col-span-1"></div>
      <div className="col-span-3 lg:col-span-2 xl:col-span-1">
        <h2 className={`${outfit.className} py-10 text-3xl`}>{title}</h2>
        <div className="">
          <div className={`${zilla.className} text-sm mb-4`}>{explanation}</div>
          {image1 && (
            <AlertDialog>
              <AlertDialogTrigger>
                <div className="relative">
                  <Image
                    width={500}
                    height={500}
                    src={image1 || "/images/website-images/placeholder.jpg"}
                    alt="Avatar"
                    className={`object-cover ${aspectRatio} rounded-lg`}
                  />
                </div>
              </AlertDialogTrigger>{" "}
              <AlertDialogContent>
                <div className="flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <div className="relative pb-[56.25%]">
                      <Image
                        fill
                        src={image1}
                        alt="Avatar"
                        className="absolute inset-0 object-contain"
                      />
                    </div>
                    <AlertDialogTrigger className="absolute top-2 right-12 lg:right-21 bg-white bg-opacity-70 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 "
                        stroke="currentColor"
                      >
                        <path strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </AlertDialogTrigger>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className={`${outfit.className} text-xl font-medium pb-2 pt-10`}>
            {subtitle}
          </div>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={`${zilla.className} mb-4`}>
              {index + 1}. {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToTemplate;
