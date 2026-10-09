import { type ReactNode } from "react";

import { downloadUrl } from "@/lib/file-utils";

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ViewFileDialogProps {
  fileUrl?: string | null;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}
 
export function ViewFileDialog({
  fileUrl,
  title,
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
      <DialogContent className="w-fit max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[75vh] items-center justify-center overflow-auto rounded-md min-h-[200px] min-w-[300px]">
          {fileUrl && isImage && (
            <img src={fileUrl} alt={title} className="h-auto w-auto max-h-[55vh] max-w-full" />
          )}
          {fileUrl && isPdf && (
            <iframe src={fileUrl} title={title} className="h-[55vh] w-[60vw] max-w-full" />
          )}
          {!fileUrl && (
            <p className="p-8 text-sm text-slate-500 animate-pulse">
              Carregando arquivo...
            </p>
          )}
        </div>

        {children}
        
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