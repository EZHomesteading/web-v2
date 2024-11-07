import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface MessageImageProps {
  src: string | null;
}

export const MessageImage: React.FC<MessageImageProps> = ({ src }) => {
  if (!src) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="relative m-5">
          <Image
            src={src}
            height={180}
            width={180}
            alt="Message attachment"
            className="aspect-square rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
            Click to Enlarge
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex justify-center">
        <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
          <Image
            src={src}
            fill
            className="object-cover w-full"
            alt="Message attachment full size"
          />
          <AlertDialogCancel className="absolute top-3 right-3">
            Close
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
