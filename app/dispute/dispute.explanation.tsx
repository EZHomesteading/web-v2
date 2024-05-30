//disputes help button/ explanation of what a dispute is
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { UserRole } from "@prisma/client";
import { useState } from "react";

interface Dispute {
  id: string;
  userId: string;
  images: string[];
  status: number;
  reason: string;
  explanation: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  order: {
    conversationId: string | null;
    buyer: {
      id: string;
      email: string;
      phoneNumber: string | null;
      firstName: string | null;
      createdAt: Date;
      role: UserRole;
    };
    seller: {
      id: string;
      email: string;
      phoneNumber: string | null;
      firstName: string | null;
      createdAt: Date;
      role: UserRole;
    };
  };
}
interface ExplanationDialogProps {
  dispute: Dispute;
  onConfirm: (explanation: string) => void;
}

export function ExplanationDialog({
  dispute,
  onConfirm,
}: ExplanationDialogProps) {
  const [explanation, setExplanation] = useState("");

  const handleConfirm = () => {
    onConfirm(explanation);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black">
          Provide Explanation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dispute Explanation</DialogTitle>
          <DialogDescription>
            Provide an explanation for your decision regarding this dispute.
            This explanation will be included in the email sent to the user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
