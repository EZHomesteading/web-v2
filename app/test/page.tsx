"use client";

import { UploadButton } from "@/utils/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        className="ut-allowed-content:hidden ut-button:bg-lime-800 ut-button:text-white aspect-square ut-button:w-48 ut-button:h-48 ut-button:border-green-500 ut-button:border-2 ut-button:focus:outline-green-500"
      />
    </main>
  );
}
