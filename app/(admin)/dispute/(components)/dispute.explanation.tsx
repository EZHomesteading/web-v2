//disputes help button/ explanation of what a dispute is
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ExplanationDialogProps {
  onConfirm: (explanation: string) => void;
}

export function ExplanationDialog({ onConfirm }: ExplanationDialogProps) {
  const [explanation, setExplanation] = useState("");

  const handleConfirm = () => {
    onConfirm(explanation);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black">
          Provide Explanation for
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
