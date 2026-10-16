import { useState, useEffect } from "react";
import { Download, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadUrl } from "@/lib/file-utils";
import type { TimelineSurveyItem } from "../student-portfolio.types";
import { getSurveyLevelStyle } from "@/lib/survey-utils";
import { getSurveyImageService } from "@/surveys/surveys.service";

interface ViewEvidenceDialogProps {
  open: boolean;
  survey: TimelineSurveyItem | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewEvidenceDialog({
  open,
  survey,
  onOpenChange
}: Readonly<ViewEvidenceDialogProps>) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (!open || !survey) {
      setResolvedUrl(null);
      setIsLoadingImage(false);
      return;
    }

    if (survey.evidenceUrl) {
      setResolvedUrl(survey.evidenceUrl);
      setIsLoadingImage(false);
      return;
    }

    if (survey.hasEvidence) {
      const surveyId = survey.surveyId ?? survey.id;
      if (surveyId) {
        setIsLoadingImage(true);
        getSurveyImageService(surveyId)
          .then((url) => {
            setResolvedUrl(url);
          })
          .catch(() => {
            setResolvedUrl(null);
          })
          .finally(() => {
            setIsLoadingImage(false);
          });
      }
    } else {
      setResolvedUrl(null);
      setIsLoadingImage(false);
    }
  }, [open, survey]);

  if (!survey) return null;

  const isPdf = resolvedUrl?.toLowerCase().includes(".pdf");
  const isImage = Boolean(resolvedUrl && !isPdf);
  const levelStyle = getSurveyLevelStyle(survey.levelCode);

  const handleDownload = () => {
    if (!resolvedUrl) return;
    downloadUrl(resolvedUrl, `${survey.strand}_${survey.activityTitle}_${survey.bimester}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-2xl bg-white rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="border-b border-neutral-100 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900">
            Evidência da Sondagem
          </DialogTitle>
          <p className="text-xs text-slate-500">
            {survey.strand} • {survey.bimester} — {survey.activityTitle} ({survey.date})
          </p>
        </DialogHeader>

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 p-6 text-center">
          {isLoadingImage && (
            <div className="flex flex-col items-center gap-2.5 text-slate-500">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Carregando evidência do Supabase Storage...</p>
            </div>
          )}

          {!isLoadingImage && resolvedUrl && isImage && (
            <img
              src={resolvedUrl}
              alt={`Evidência da sondagem: ${survey.activityTitle}`}
              className="h-auto max-h-[55vh] max-w-full rounded-lg shadow-sm"
            />
          )}

          {!isLoadingImage && resolvedUrl && isPdf && (
            <iframe
              src={resolvedUrl}
              title={`Evidência da sondagem: ${survey.activityTitle}`}
              className="h-[55vh] w-full rounded-lg border border-neutral-200"
            />
          )}

          {!isLoadingImage && !resolvedUrl && (
            <div className="flex flex-col items-center max-w-md space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ImageIcon className="size-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-700">
                  Nenhuma imagem anexada
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Não foi digitalizado ou anexado nenhum arquivo de folha de produção para esta sondagem.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Resultado Formatado e Botão de Ação Proporcional */}
        <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-neutral-100 pt-4">
          <div className="flex flex-wrap items-center gap-2.5 text-sm shrink-0">
            <span className="text-slate-600 font-medium">Resultado:</span>
            <span
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 font-bold text-xs sm:text-sm shadow-2xs ${levelStyle.bg} ${levelStyle.text}`}
            >
              {survey.levelLabel}
            </span>
          </div>

          {resolvedUrl && (
            <Button
              type="button"
              onClick={handleDownload}
              className="w-full sm:w-auto shrink-0 inline-flex h-10 items-center justify-center gap-2.5 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#002856] cursor-pointer"
            >
              <Download className="size-4" />
              <span>Baixar arquivo</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
