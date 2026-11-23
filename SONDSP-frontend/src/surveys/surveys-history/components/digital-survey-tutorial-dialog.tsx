import { useState } from "react";

import { 
  Copy, 
  Globe, 
  Lightbulb, 
  QrCode, 
  SquareCheckBig, 
  type LucideIcon 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TUTORIAL_HIDDEN_KEY = "digital-survey-tutorial:hidden";

const OPEN_OPTIONS: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  highlight?: string;
  text: string;
}> = [
  {
    icon: QrCode,
    title: "Pelo QR Code",
    highlight: "Mais rápido",
    text: "Abra a câmera do tablet, aponte para o QR Code na tela e toque no link que aparecer."
  },
  {
    icon: Copy,
    title: "Copiando o link",
    text: "Clique no ícone de copiar ao lado do endereço para enviá-lo ao tablet (por WhatsApp, e-mail ou aplicativo de mensagens)."
  },
  {
    icon: Globe,
    title: "Digitando no navegador",
    text: "Abra o navegador do tablet (Chrome, Safari, etc.) e digite exatamente o endereço exibido na tela."
  }
];

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
      <DialogContent className="flex max-h-[90dvh] w-full max-w-[calc(100%-2rem)] flex-col sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-neutral-100 pr-6 pb-3 text-left">
          <DialogTitle className="text-base font-bold text-slate-900">
            Como abrir a sondagem no tablet
          </DialogTitle>
        </DialogHeader>

        <div className="-mx-1 min-h-0 flex-1 space-y-4 overflow-y-auto px-1 pb-1">
          <DialogDescription className="text-sm text-slate-600">
            Na próxima tela, você verá o QR Code e o link exclusivo desta sondagem. Escolha uma das 3 formas
            abaixo para abrir a atividade no tablet do aluno:
          </DialogDescription>

          <ol className="space-y-3">
            {OPEN_OPTIONS.map(({ icon: Icon, title, highlight, text }) => (
              <li key={title} className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <Icon className="size-5" />
                </span>

                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-900">
                    {title}
                    {highlight && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {highlight}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <p>
              <span className="font-semibold">Dica:</span> Assim que o aluno abrir o link, a sondagem já estará
              pronta para responder. Quando ele finalizar, lembre-se de clicar no ícone de finalização{" "}
              <SquareCheckBig aria-hidden="true" className="inline size-4 align-text-bottom" /> no seu painel
              para travar a resposta.
            </p>
          </div>
        </div>

        <DialogFooter className="flex shrink-0 flex-col gap-3 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-600">
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