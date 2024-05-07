"use client";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";

export default function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.error("Event has been created", {
          style: {},
        })
      }
    >
      Show Toast
    </Button>
  );
}
