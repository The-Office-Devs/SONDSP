import { useState } from "react";

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TUTORIAL_HIDDEN_KEY = "digital-survey-tutorial:hidden";

export function shouldShowDigitalSurveyTutorial() {
  try {
    return localStorage.getItem(TUTORIAL_HIDDEN_KEY) !== "true";
  } catch {
    return true;
  }
}

interface DigitalSurveyTutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DigitalSurveyTutorialDialog({
  open,
  onOpenChange
}: Readonly<DigitalSurveyTutorialDialogProps>) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && dontShowAgain) {
      try {
        localStorage.setItem(TUTORIAL_HIDDEN_KEY, "true");
      } catch {
        // Sem acesso ao storage: o tutorial volta a aparecer da próxima vez
      }
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader className="border-b border-neutral-100 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900">
            Como abrir a sondagem no tablet
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Tutorial de como abrir a sondagem no tablet
        </div>

        <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
              className="size-4 cursor-pointer accent-primary"
            />
            Não exibir novamente
          </label>

          <Button
            size="lg"
            onClick={() => handleOpenChange(false)}
            className="border-transparent bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto sm:min-w-32"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}