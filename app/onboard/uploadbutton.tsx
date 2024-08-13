"use client";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
type Input = Parameters<typeof useUploadThing>;
const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const result = await $ut.startUpload(selectedFiles);
    console.log("uploaded files", result);
  };
  return {
    inputProps: {
      onChange,
      multiple: ($ut.permittedFileInfo?.config?.image?.maxFileCount ?? 1) > 1,
      accept: "image/*",
    },
    isUploading: $ut.isUploading,
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
function LoadingSpinnerSVG() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="spinner_ajPY"
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
  const { inputProps, isUploading } = useUploadThingInputProps(
    "imageUploader",
    {
      onUploadBegin() {
        toast(
          <div className="flex items-center gap-2 text-white">
            <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
          </div>,
          {
            duration: 100000,
            id: "upload-begin",
          }
        );
      },
      onUploadError(error) {
        toast.dismiss("upload-begin");
        toast.error("Upload failed");
      },
      onClientUploadComplete(res) {
        toast.dismiss("upload-begin");
        toast("Upload complete!");
        if (res && res[0] && res[0].url) {
          onUploadComplete(res[0].url);
        }
      },
    }
  );

  return (
    <div className="relative inline-block">
      <label
        htmlFor="upload-button"
        className="cursor-pointer inline-flex items-center justify-center w-24 h-24 rounded-md hover:bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors"
      >
        {isUploading ? <LoadingSpinnerSVG /> : <UploadSVG />}
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        {...inputProps}
      />
      <style jsx>{`
        label:focus-within {
          outline: none;
        }
      `}</style>
    </div>
  );
}
