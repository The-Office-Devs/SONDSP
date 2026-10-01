import { useEffect, useState } from "react";

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
  file?: File | null;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}
 
export function ViewFileDialog({
  file,
  title,
  open,
  onOpenChange,
  children
}: Readonly<ViewFileDialogProps>) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDownload = () => {
    if (!file || !url) return;
    downloadUrl(url, file.name);
  };

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[75vh] items-center justify-center overflow-auto rounded-md min-h-[200px] min-w-[300px]">
          {url && isImage && (
            <img src={url} alt={title} className="h-auto w-auto max-h-[55vh] max-w-full" />
          )}
          {url && isPdf && (
            <iframe src={url} title={title} className="h-[55vh] w-[60vw] max-w-full" />
          )}
          {(!url) && (
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
            disabled={!file}
          >
            Baixar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}