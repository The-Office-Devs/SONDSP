import { 
  Dialog, 
  DialogContent,
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { SurveyListItem } from "@/surveys/surveys.types";

interface FinishDigitalSurveyDialogProps {
  data: SurveyListItem | null;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: SurveyListItem) => void;
}

export function FinishDigitalSurveyDialog({ 
  data, 
  open, 
  isPending,
  onOpenChange,
  onConfirm
}: Readonly<FinishDigitalSurveyDialogProps>) {
  const handleConfirm = () => {
    if (!data) return;
    onConfirm(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle> Deseja finalizar a sondagem digital? </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700 sm:flex-1"
          >
            Não
          </Button>

          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isPending}
            className="border-transparent bg-emerald-600 text-white hover:bg-emerald-700 sm:flex-1"
          >
            {isPending ? "Finalizando..." : "Sim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}