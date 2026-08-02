import { useEffect, useState } from "react";

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ViewFileDialogProps {
  file: File | null; // pode exibir imagem ou pdf... nao usado por enquanto --> esperando back
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
 
export function ViewFileDialog({
  title,
  open,
  onOpenChange
}: Readonly<ViewFileDialogProps>) {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;

    let active = true;
    fetch("/teste.png")
      .then((res) => res.blob())
      .then((blob) => {
        if (active) {
          setFile(new File([blob], "teste.png", { type: blob.type }))
        }
      });
    return () => { active = false }
  }, [open]);

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
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "modelo_atividade";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[75vh] items-center overflow-auto rounded-md">
          {url && isImage && (
            <img src={url} alt={title} className="h-auto w-auto max-h-[55vh] max-w-full" />
          )}
          {url && isPdf && (
            <iframe src={url} title={title} className="h-[55vh] w-[60vw] max-w-full" />
          )}
          {!url && (
            <p className="p-8 text-sm text-slate-500">Carregando arquivo...</p>
          )}
        </div>
        
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