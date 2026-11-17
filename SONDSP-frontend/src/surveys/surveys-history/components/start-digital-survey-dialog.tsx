import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { SurveyListItem } from "@/surveys/surveys.types";

interface StartDigitalSurveyDialogProps {
  data: SurveyListItem | null;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: SurveyListItem) => void;
}

export function StartDigitalSurveyDialog({ 
  data, 
  open, 
  isPending,
  onOpenChange,
  onConfirm
}: Readonly<StartDigitalSurveyDialogProps>) {
  const handleConfirm = () => {
    if (!data) return;
    onConfirm(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle> Deseja realizar a sondagem digitalmente? </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700"
          >
            Não
          </Button>

          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Sim
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}