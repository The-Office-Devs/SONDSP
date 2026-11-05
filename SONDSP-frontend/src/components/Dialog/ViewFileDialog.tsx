import { type ReactNode } from "react";

import { downloadUrl } from "@/lib/file-utils";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";

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

  const handleDownload = () => {
    if (!fileUrl) return;
    downloadUrl(fileUrl, title);
  };

  const isPdf = fileUrl?.toLowerCase().includes(".pdf");
  const isImage = !isPdf;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex max-h-[90vh] w-fit max-w-[min(90vw,48rem)] flex-col"
        {...(subtitle ? {} : { "aria-describedby": undefined })}
      >
        <DialogHeader className="border-b border-neutral-100 pt-2 pr-2 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900">{title}</DialogTitle>
          {subtitle && (
            <DialogDescription className="text-sm font-medium text-slate-500">Estudante: {subtitle}</DialogDescription>
          )}
        </DialogHeader>

        <div className="-mr-2 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
          <div className="flex min-h-[200px] min-w-[300px] items-center justify-center rounded-md">
            {fileUrl && isImage && (
              <img src={fileUrl} alt={title} className="h-auto w-auto max-h-[50vh] max-w-full" />
            )}
            {fileUrl && isPdf && (
              <iframe src={fileUrl} title={title} className="h-[50vh] w-[60vw] max-w-full" />
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