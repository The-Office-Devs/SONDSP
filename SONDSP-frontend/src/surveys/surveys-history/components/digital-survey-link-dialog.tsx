import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function getDigitalSurveyUrl(surveyId: number) {
  return `${window.location.origin}/sondagem-digital/${surveyId}`;
}

interface DigitalSurveyLinkDialogProps {
  surveyId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DigitalSurveyLinkDialog({
  surveyId,
  open,
  onOpenChange
}: Readonly<DigitalSurveyLinkDialogProps>) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const url = surveyId ? getDigitalSurveyUrl(surveyId) : "";
  // tira o https da visualização
  const displayUrl = url.replace(/^https?:\/\//, ""); 

  const handleCopy = async () => {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-full max-w-[calc(100%-2rem)] sm:max-w-md"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="px-6 text-center sm:text-center">
          <DialogTitle className="text-base font-semibold text-slate-900">
            Abra o site a seguir no dispositivo móvel:
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-slate-50 px-3 py-2">
          <span className="min-w-0 truncate text-sm font-medium text-slate-700 select-all">
            {displayUrl}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copiado!" : "Copiar link"}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 sm:size-8"
          >
            {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
          </button>
        </div>

        {url && (
          <div className="flex justify-center">
            <div className="rounded-xl border border-neutral-200 bg-white p-3">
              <QRCodeSVG value={url} size={180} marginSize={1} title="QR code do link da sondagem" />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-slate-600 hover:text-slate-900"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}