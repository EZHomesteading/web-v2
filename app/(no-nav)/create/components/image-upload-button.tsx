"use client";
import Loader from "@/components/secondary-loader";
import { useUploadThing } from "@/utils/uploadthing";
import { Outfit } from "next/font/google";
import { toast } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

type Input = Parameters<typeof useUploadThing>;

const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);
  return {
    startUpload: $ut.startUpload,
    isUploading: $ut.isUploading,
    permittedFileInfo: $ut.permittedFileInfo,
  };
};

function UploadSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={0.5}
      stroke="currentColor"
      className="h-10 w-10"
      style={{ background: "transparent" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

interface SimpleUploadButtonProps {
  onUploadComplete: (url: string) => void;
}

export function SimpleUploadButton({
  onUploadComplete,
}: SimpleUploadButtonProps) {
  const { startUpload, isUploading, permittedFileInfo } =
    useUploadThingInputProps("imageUploader", {
      onUploadBegin() {},
      onUploadError(error) {
        toast.dismiss("upload-begin");
        toast.error("Upload failed");
      },
      onClientUploadComplete(res) {
        toast.dismiss("upload-begin");
        if (res && res[0] && res[0].url) {
          onUploadComplete(res[0].url);
        }
      },
    });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    await startUpload(selectedFiles);
  };

  return (
    <div className={`${outfit.className} relative inline-block`}>
      <label
        htmlFor="upload-button"
        className="cursor-pointer inline-flex items-center justify-center w-24 h-24 rounded-md focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors"
      >
        {isUploading ? <Loader /> : <UploadSVG />}
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        onChange={handleChange}
        multiple={(permittedFileInfo?.config?.image?.maxFileCount ?? 1) > 1}
        accept="image/*"
      />
      <style jsx>{`
        label:focus-within {
          outline: none;
        }
      `}</style>
    </div>
  );
}
