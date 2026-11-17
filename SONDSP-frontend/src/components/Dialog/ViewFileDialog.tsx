import { type ReactNode } from "react";

import { downloadUrl } from "@/lib/file-utils";

import { ExternalLink, FileText } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useIsDesktop } from "@/hooks/use-media-query";

interface ViewFileDialogProps {
  fileUrl?: string | null;
  title: string;
  subtitle?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}
 
export function ViewFileDialog({
  fileUrl,
  title,
  subtitle,
  open,
  onOpenChange,
  children
}: Readonly<ViewFileDialogProps>) {
  const isDesktop = useIsDesktop();

  const handleOpenPdf = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    downloadUrl(fileUrl, title);
  };

  const isPdf = fileUrl?.toLowerCase().includes(".pdf");
  const isImage = !isPdf;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex max-h-[90dvh] w-full max-w-[calc(100%-2rem)] flex-col sm:w-fit"
        {...(subtitle ? {} : { "aria-describedby": undefined })}
      >
        <DialogHeader className="border-b border-neutral-100 pt-2 pr-6 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900">{title}</DialogTitle>
          {subtitle && (
            <DialogDescription className="text-sm font-medium text-slate-500">Estudante: {subtitle}</DialogDescription>
          )}
        </DialogHeader>

        <div className="-mr-2 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
          <div className="flex min-h-[200px] items-center justify-center rounded-md sm:min-w-[300px]">
            {fileUrl && isImage && (
              <img src={fileUrl} alt={title} className="h-auto w-auto max-h-[50dvh] max-w-full" />
            )}
            {fileUrl && isPdf && isDesktop && (
              <iframe src={fileUrl} title={title} className="h-[50dvh] w-[60vw] max-w-full" />
            )}
            {fileUrl && isPdf && !isDesktop && (
              <div className="flex flex-col items-center gap-3 p-4 text-center">
                <FileText className="size-12 text-slate-400" />
                <p className="text-sm text-slate-600">O PDF abre no visualizador do próprio celular.</p>
                <Button onClick={handleOpenPdf}>
                  <ExternalLink className="size-4" />
                  Abrir PDF
                </Button>
              </div>
            )}
            {!fileUrl && (
              <p className="p-8 text-sm text-slate-500 animate-pulse">
                Carregando arquivo...
              </p>
            )}
          </div>

          {children}
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            onClick={handleDownload} 
            disabled={!fileUrl}
          >
            Baixar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}